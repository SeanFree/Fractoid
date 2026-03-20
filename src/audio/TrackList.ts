import type { TrackMetadata } from '@/types'
import type { AudioTrack } from './AudioTrack'
import { floor, rand, swap } from '@/utils'

export class TrackList {
  private ids: string[] = []
  private idsMemo: string[] = []
  private tracks: Map<string, AudioTrack> = new Map()

  currentIndex: number = 0

  get currentTrack(): AudioTrack | undefined {
    return this.tracks.get(this.ids[this.currentIndex]!) as AudioTrack
  }

  get count() {
    return this.ids.length
  }

  get items() {
    return this.ids.map((id) => this.tracks.get(id)) as AudioTrack[]
  }

  add(track: AudioTrack) {
    this.tracks.set(track.id, track)

    if (!this.ids.includes(track.id)) {
      this.ids.push(track.id)
    }
  }

  shuffle() {
    const currentId = this.currentTrack!.id

    this.idsMemo = [...this.ids]

    let randIndex: number

    for (let i = this.ids.length - 1; i >= 0; i--) {
      randIndex = floor(rand(1) * i)

      swap(this.ids, i, this.ids, randIndex)
    }

    this.currentIndex = this.ids.indexOf(currentId)
  }

  unshuffle() {
    const currentId = this.currentTrack!.id

    this.ids = [...this.idsMemo]

    this.currentIndex = this.ids.indexOf(currentId)
  }

  getById(id: string) {
    return this.tracks.get(id)
  }

  getIndex(id: string) {
    return this.ids.indexOf(id)
  }

  setMetadata(id: string, metadata: Partial<TrackMetadata>) {
    const track = this.tracks.get(id)

    if (track) {
      track.metadata = {
        ...track.metadata,
        ...metadata,
      }
    }
  }
}
