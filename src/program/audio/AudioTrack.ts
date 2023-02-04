import type { AudioTrackParams, TrackMetadata } from '@/types'
import { v4 as uuidv4 } from 'uuid'

export class AudioTrack {
  id: string
  file?: File
  fileUrl?: string
  metadata?: TrackMetadata
  objectUrl?: string

  constructor({ id, file, fileUrl, objectUrl, metadata }: AudioTrackParams) {
    this.id = id || uuidv4()
    this.file = file
    this.fileUrl = fileUrl
    this.objectUrl = objectUrl
    this.metadata = metadata
  }

  static Empty(id?: string) {
    return new AudioTrack({ id })
  }

  get ready() {
    return !!this.objectUrl
  }
}
