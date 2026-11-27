import MP3Tag from 'mp3tag.js'
import { getDuration, getTagSize } from './mp3'

import type { Context } from 'hono'
import type { AppEnv } from './types'
import type {
  TrackListItem,
  TrackListResponse,
  TrackMetadata,
} from '../src/types/audio'

const AUDIO_PREFIX = 'audio/'
const AUDIO_EXTENSION = '.mp3'

// Covers the ID3 tag (including artwork) of a typical file in one read.
// Larger tags get a second read of the exact size.
const HEAD_READ_SIZE = 64 * 1024

// Room after the tag for padding and the first frame's Xing header
const FRAME_READ_MARGIN = 4 * 1024

const TRACK_NAME_PATTERN = /^[\w.-]+$/

interface TrackHead {
  bytes: Uint8Array
  size: number
  tagSize: number
}

interface Artwork {
  data: Uint8Array<ArrayBuffer>
  format: string
}

const readHead = async (
  bucket: R2Bucket,
  key: string
): Promise<TrackHead | null> => {
  const head = await bucket.get(key, {
    range: { offset: 0, length: HEAD_READ_SIZE },
  })

  if (!head) return null

  let bytes = new Uint8Array(await head.arrayBuffer())

  const tagSize = getTagSize(bytes)
  const length = Math.min(tagSize + FRAME_READ_MARGIN, head.size)

  if (length > bytes.length) {
    const full = await bucket.get(key, { range: { offset: 0, length } })

    if (!full) return null

    bytes = new Uint8Array(await full.arrayBuffer())
  }

  return { bytes, size: head.size, tagSize }
}

const readTags = ({ bytes, tagSize }: TrackHead) => {
  const tags = MP3Tag.readBuffer(bytes.slice(0, tagSize).buffer, {
    id3v1: false,
    mp4: false,
    aiff: false,
    aac: false,
  })
  const picture = tags.v2?.APIC?.[0]
  const artwork: Artwork | undefined = picture
    ? { data: new Uint8Array(picture.data), format: picture.format }
    : undefined

  return { tags, artwork }
}

const getTrackName = (key: string): string =>
  key.slice(AUDIO_PREFIX.length, -AUDIO_EXTENSION.length)

/** The R2 key for a track name from a URL, or null when the name isn't valid */
export const getTrackKey = (name: string | undefined): string | null =>
  name && TRACK_NAME_PATTERN.test(name)
    ? `${AUDIO_PREFIX}${name}${AUDIO_EXTENSION}`
    : null

const toTrackListItem = (key: string, head: TrackHead): TrackListItem => {
  const name = getTrackName(key)
  const { tags, artwork } = readTags(head)
  const metadata: TrackMetadata = {
    title: tags.title || name,
    artist: tags.artist || undefined,
    album: tags.album || undefined,
    genre: tags.genre || undefined,
    year: tags.year || undefined,
    duration: getDuration(head.bytes, head.tagSize, head.size),
    artwork: artwork ? `/api/artwork/${name}` : undefined,
  }

  return { fileUrl: `/api/audio/${name}`, metadata }
}

const listTrackKeys = async (bucket: R2Bucket): Promise<string[]> => {
  const keys: string[] = []

  let cursor: string | undefined

  do {
    const page = await bucket.list({ prefix: AUDIO_PREFIX, cursor })

    for (const { key } of page.objects) {
      if (key.endsWith(AUDIO_EXTENSION)) keys.push(key)
    }

    cursor = page.truncated ? page.cursor : undefined
  } while (cursor)

  return keys
}

export const handleTrackList = async (
  c: Context<AppEnv>
): Promise<Response> => {
  const bucket = c.env.FRACTOID
  const keys = await listTrackKeys(bucket)

  const items = await Promise.all(
    keys.map(async (key) => {
      try {
        const head = await readHead(bucket, key)

        return head ? toTrackListItem(key, head) : null
      } catch (err) {
        console.error(`Could not read tags for ${key}`, err)

        return null
      }
    })
  )

  const body: TrackListResponse = {
    tracks: items.filter((item) => item !== null),
  }

  return c.json(body, 200, { 'cache-control': 'public, max-age=300' })
}

export const handleArtwork = async (c: Context<AppEnv>): Promise<Response> => {
  const key = getTrackKey(c.req.param('name'))

  if (!key) return c.notFound()

  const head = await readHead(c.env.FRACTOID, key)
  const artwork = head ? readTags(head).artwork : undefined

  if (!artwork) return c.notFound()

  return c.body(artwork.data, 200, {
    'content-type': artwork.format,
    'cache-control': 'public, max-age=86400',
  })
}
