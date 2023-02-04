import type { AudioTrack } from '@/program'

export interface AnalyserConfig {
  fftSize: number
  maxDecibels: number
  minDecibels: number
  smoothingTimeConstant: number
}

export interface TrackMetadata {
  album?: string
  artist?: string
  artwork?: string
  genre?: string
  duration?: number
  title?: string
  year?: string
}

export interface AudioTrackParams {
  id?: string
  file?: File
  fileUrl?: string
  objectUrl?: string
  metadata?: TrackMetadata
}

export interface TrackList {
  currentIndex: number
  currentTrack: AudioTrack
  ids: string[]
  idsMemo: string[]
  tracks: {
    [id: string]: AudioTrack
  }
}

export type AudioEventHandler = (e: Event) => unknown

export type PlaythroughType = 'repeat' | 'repeat_one' | 'shuffle'

export type AudioChannel = 0 | 1 | 2 | 3 | 4 | 5 | 6

export type AudioCoreEvent =
  | 'audioprocess'
  | 'canplay'
  | 'canplaythrough'
  | 'complete'
  | 'durationchange'
  | 'emptied'
  | 'ended'
  | 'pause'
  | 'play'
  | 'playing'
  | 'ratechange'
  | 'seeked'
  | 'seeking'
  | 'stalled'
  | 'suspend'
  | 'timeupdate'
  | 'volumechange'
  | 'waiting'

export type AudioControllerEvent =
  | 'loading'
  | 'loaded'
  | 'skip'
  | 'eqPresetChange'
  | 'shuffle'
  | 'unshuffle'
  | 'trackChange'

export type GraphicEqFrequency =
  | 32
  | 64
  | 128
  | 256
  | 512
  | 1000
  | 2000
  | 4000
  | 8000
  | 10000
  | 13000
  | 16000

export type GraphicEqPresetName =
  | 'flat'
  | 'acoustic'
  | 'electronic'
  | 'latin'
  | 'piano'
  | 'pop'
  | 'rock'
  | 'bass'

export type GraphicEqPreset = {
  [frequency in GraphicEqFrequency]?: number
}
