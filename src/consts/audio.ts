import type {
  AnalyserConfig,
  GraphicEqFrequency,
  PlaythroughType,
  AudioChannelID,
  AudioCoreEvent,
  AudioControllerEvent,
  AudioChannelName,
} from '@/types'

export const AUDIO_CHANNELS: Record<AudioChannelName, AudioChannelID> = {
  SUB_BASS: 0,
  BASS: 1,
  LOW_MID: 2,
  MID: 3,
  HIGH_MID: 4,
  PRESENCE: 5,
  BRILLIANCE: 6,
}

export const AUDIO_SPECTRUM_RANGE: Record<AudioChannelID, [number, number]> = {
  0: [16, 60],
  1: [60, 250],
  2: [250, 500],
  3: [500, 2000],
  4: [2000, 4000],
  5: [4000, 6000],
  6: [6000, 16000],
}

export const GRAPHIC_EQ_FREQUENCIES: GraphicEqFrequency[] = [
  32, 64, 128, 256, 512, 1000, 2000, 4000, 8000, 10000, 13000, 16000,
]

export const AUDIO_CORE_EVENTS: Record<AudioCoreEvent, AudioCoreEvent> = {
  audioprocess: 'audioprocess',
  canplay: 'canplay',
  canplaythrough: 'canplaythrough',
  complete: 'complete',
  durationchange: 'durationchange',
  emptied: 'emptied',
  ended: 'ended',
  pause: 'pause',
  play: 'play',
  playing: 'playing',
  ratechange: 'ratechange',
  seeked: 'seeked',
  seeking: 'seeking',
  stalled: 'stalled',
  suspend: 'suspend',
  timeupdate: 'timeupdate',
  volumechange: 'volumechange',
  waiting: 'waiting',
}

export const AUDIO_CONTROLLER_EVENTS: Record<
  AudioControllerEvent,
  AudioControllerEvent
> = {
  eqPresetChange: 'eqPresetChange',
  loading: 'loading',
  loaded: 'loaded',
  skip: 'skip',
  shuffle: 'shuffle',
  unshuffle: 'unshuffle',
  trackChange: 'trackChange',
  trackMetaUpdated: 'trackMetaUpdated',
  playthroughChange: 'playthroughChange',
}

export const PLAYTHROUGH_OPTIONS: PlaythroughType[] = [
  'repeat',
  'repeat_one',
  'shuffle',
]

export const TRACK_URL_BASE = '/audio'

export const TRACK_LIST_DEFAULT = [
  `${TRACK_URL_BASE}/Bad_Snacks_New_Moon.mp3`,
  `${TRACK_URL_BASE}/Subway_Dreams_Dan_Henig.mp3`,
  `${TRACK_URL_BASE}/Ebb_and_Flow_Dyalla.mp3`,
  `${TRACK_URL_BASE}/Lost_Time_Eveningland.mp3`,
  `${TRACK_URL_BASE}/Stars_JVNA.mp3`,
]

export const ANALYSER_CONFIG_DEFAULT: AnalyserConfig = {
  fftSize: 1024,
  maxDecibels: -10,
  minDecibels: -140,
  smoothingTimeConstant: 0.965,
}

export const VOLUME_TYPES = [
  'volume_off',
  'volume_mute',
  'volume_down',
  'volume_up',
]

export type VolumeType = (typeof VOLUME_TYPES)[number]

export const VOLUME_DEFAULT = 0.75
