import { bufferToObjectURL } from '@/utils/buffer'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'

import type { TrackMetadata } from '@/types'
import { AudioTrack } from '@/program'

const jsmediatags = (window as any).jsmediatags

export class TrackClient {
  private el: HTMLAudioElement

  baseUrl: string

  constructor(baseUrl = '') {
    this.baseUrl = baseUrl
    this.el = document.createElement('audio')
  }

  async fetch(url: string): Promise<File | null> {
    try {
      const { status, statusText, data } = await axios.get<Blob>(
        `${this.baseUrl}${url}`,
        {
          responseType: 'blob',
        }
      )

      if (status === 200) {
        return new File([data], url, { type: data.type })
      } else {
        console.error({ status, statusText })

        return null
      }
    } catch (err) {
      console.error(err)

      return null
    }
  }

  async fetchTrack(url: string): Promise<AudioTrack | null> {
    try {
      const file = (await this.fetch(url)) as File

      const track = await this.createTrack(file)

      return track
    } catch {
      return null
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
    fileUrl = '',
    objectUrl,
  }: {
    id?: string
    file?: File
    fileUrl?: string
    objectUrl?: string
  }): Promise<AudioTrack> {
    const $id: string = id || uuidv4()
    const metadata: TrackMetadata | undefined =
      file && objectUrl ? await this.getMetadata(file, objectUrl) : undefined

    return new AudioTrack({
      id: $id,
      file,
      fileUrl: fileUrl && `${this.baseUrl}${fileUrl}`,
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

      const done = () => {
        const { duration } = audio

        audio.removeEventListener('loadeddata', done)

        resolve(duration)
      }

      // @todo: error handling

      audio.addEventListener('loadeddata', done)
      audio.src = objectUrl
    })
  }

  async getTags(file: File): Promise<Partial<TrackMetadata>> {
    return new Promise((resolve, reject) => {
      jsmediatags.read(file, {
        onSuccess(result: any) {
          const {
            tags: {
              artist = 'Artist Unknown',
              title = 'Title Unknown',
              picture,
              album = 'Album Unknown',
              year = 'Year Unknown',
              genre = 'Genre Unknown',
            },
          } = result
          const artwork = picture && bufferToObjectURL(picture.data)

          resolve({
            artwork,
            artist,
            album,
            title,
            year,
            genre,
          })
        },
        onError: reject,
      })
    })
  }
}
