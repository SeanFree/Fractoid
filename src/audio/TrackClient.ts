import { v4 as uuidv4 } from 'uuid'
import MP3Tag from 'mp3tag.js'
import { AudioTrack } from '@/audio'
import { bufferToObjectURL } from '@/utils/buffer'

import type { TrackListItem, TrackListResponse, TrackMetadata } from '@/types'

export class TrackClient {
  private el: HTMLAudioElement

  constructor() {
    this.el = document.createElement('audio')
  }

  async fetchTrackList(url: string): Promise<TrackListItem[]> {
    try {
      const response = await fetch(url)

      if (!response.ok) {
        console.error(`Could not load track list: ${response.status}`)

        return []
      }

      const { tracks } = (await response.json()) as TrackListResponse

      return tracks
    } catch (err) {
      console.error('Could not load track list', err)

      return []
    }
  }

  async createTrack(file: File): Promise<AudioTrack | null> {
    if (!this.validate(file)) {
      console.error(`Could not load file with type: ${file.type}`)

      return null
    }

    const objectUrl = this.fileToObjectUrl(file)

    return this.wrap({ file, objectUrl })
  }

  fileToObjectUrl(file: File): string | undefined {
    if (!this.validate(file)) {
      console.error(`Could not load file with type: ${file.type}`)

      return undefined
    }

    return window.URL.createObjectURL(file)
  }

  async wrap({
    id,
    file,
    objectUrl,
  }: {
    id?: string
    file?: File
    objectUrl?: string
  }): Promise<AudioTrack> {
    const $id: string = id || uuidv4()
    const metadata: TrackMetadata | undefined =
      file && objectUrl ? await this.getMetadata(file, objectUrl) : undefined

    return new AudioTrack({
      id: $id,
      file,
      objectUrl,
      metadata,
    })
  }

  validate(file: File) {
    return this.el.canPlayType(file.type)
  }

  async getMetadata(file: File, objectUrl: string): Promise<TrackMetadata> {
    const duration = await this.getDuration(objectUrl)

    const tags = await this.getTags(file)

    return {
      duration,
      ...tags,
    }
  }

  getDuration(objectUrl: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const audio: HTMLAudioElement = document.createElement('audio')

      const onLoaded = () => {
        const { duration } = audio

        audio.removeEventListener('loadeddata', onLoaded)

        resolve(duration)
      }

      const onError = (e: ErrorEvent) => {
        reject(`Failed to read file duration: ${e.message}`)
      }

      audio.addEventListener('loadeddata', onLoaded)
      audio.addEventListener('error', onError)
      audio.src = objectUrl
    })
  }

  async getTags(file: File): Promise<Partial<TrackMetadata>> {
    const tags = await MP3Tag.readBlob(file)

    const {
      artist = 'Unknown Artist',
      album = 'Unknown Album',
      title = 'Unknown Title',
      genre = 'Unknown Genre',
      year = 'Unknown Year',
    } = tags.v1 ?? {}

    const { APIC } = tags.v2 ?? {}

    const artwork = APIC?.length ? bufferToObjectURL(APIC[0]!.data) : undefined

    return {
      artist,
      album,
      title,
      genre,
      year,
      artwork,
    }
  }
}
