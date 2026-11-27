import MP3Tag from 'mp3tag.js'

// MPEG1 Layer III, 128 kbps, 44.1 kHz, stereo
const FRAME_HEADER = [0xff, 0xfb, 0x90, 0x00]
const FRAME_SIZE = 417
const SIDE_INFO_SIZE = 32

export const SAMPLES_PER_FRAME = 1152
export const SAMPLE_RATE = 44100
export const BITRATE = 128000

interface Mp3Options {
  frames?: number
  xing?: boolean
  tags?: {
    title?: string
    artist?: string
    album?: string
    year?: string
    artwork?: number[]
  }
}

const writeUint32 = (bytes: Uint8Array, offset: number, value: number) => {
  new DataView(bytes.buffer).setUint32(offset, value)
}

/** A minimal MP3: an optional ID3v2.3 tag, then `frames` audio frames */
export const createMp3 = ({
  frames = 10,
  xing = true,
  tags,
}: Mp3Options = {}): Uint8Array<ArrayBuffer> => {
  const audio = new Uint8Array(FRAME_SIZE * frames)

  for (let i = 0; i < frames; i++) {
    audio.set(FRAME_HEADER, i * FRAME_SIZE)
  }

  if (xing) {
    const xingOffset = 4 + SIDE_INFO_SIZE

    audio.set(
      [...'Xing'].map((char) => char.charCodeAt(0)),
      xingOffset
    )
    writeUint32(audio, xingOffset + 4, 1)
    writeUint32(audio, xingOffset + 8, frames)
  }

  if (!tags) return audio

  // mp3tag.js rejects frames set to undefined, so only include those given
  const tagFrames = Object.fromEntries(
    Object.entries({
      TIT2: tags.title,
      TPE1: tags.artist,
      TALB: tags.album,
      TYER: tags.year,
      APIC: tags.artwork && [
        { format: 'image/jpeg', type: 3, description: '', data: tags.artwork },
      ],
    }).filter(([, value]) => value !== undefined)
  )

  const tagged = MP3Tag.writeBuffer(audio.buffer, { v2: tagFrames } as never, {
    id3v1: { include: false },
    id3v2: { padding: 0 },
  })

  return new Uint8Array(tagged as ArrayBuffer)
}

interface StoredObject {
  data: Uint8Array
  contentType?: string
}

const parseRangeHeader = (value: string, size: number): R2Range => {
  const [start = '', end = ''] = value.replace('bytes=', '').split('-')

  if (!start) return { suffix: Number(end) }

  const offset = Number(start)

  return {
    offset,
    length: (end ? Number(end) : size - 1) - offset + 1,
  }
}

const sliceRange = (data: Uint8Array, range?: R2Range): Uint8Array => {
  if (!range) return data

  if ('suffix' in range) return data.slice(data.length - range.suffix)

  const offset = range.offset ?? 0

  return data.slice(offset, offset + (range.length ?? data.length - offset))
}

/**
 * An in-memory stand-in for the R2 binding, covering the parts of `get` and
 * `list` the Worker uses. Keys in `failing` throw on `get`.
 */
export const createBucket = (
  objects: Record<string, StoredObject>,
  failing: string[] = []
): R2Bucket =>
  ({
    async get(key: string, options?: R2GetOptions) {
      if (failing.includes(key)) throw new Error(`Failed to read ${key}`)

      const object = objects[key]

      if (!object) return null

      const size = object.data.length
      const rangeOption = options?.range
      const range =
        rangeOption instanceof Headers
          ? rangeOption.has('Range')
            ? parseRangeHeader(rangeOption.get('Range')!, size)
            : undefined
          : rangeOption
      const body = sliceRange(object.data, range)

      return {
        key,
        size,
        range,
        httpEtag: '"etag"',
        body: new Response(body).body,
        arrayBuffer: async () => body.slice().buffer,
        writeHttpMetadata: (headers: Headers) => {
          if (object.contentType) {
            headers.set('content-type', object.contentType)
          }
        },
      }
    },
    async list({ prefix = '' }: R2ListOptions = {}) {
      return {
        objects: Object.keys(objects)
          .filter((key) => key.startsWith(prefix))
          .map((key) => ({ key })),
        truncated: false,
      }
    },
  }) as unknown as R2Bucket

export const executionCtx = {
  waitUntil: () => {},
  passThroughOnException: () => {},
} as unknown as ExecutionContext

export const sameOrigin = { headers: { 'Sec-Fetch-Site': 'same-origin' } }
