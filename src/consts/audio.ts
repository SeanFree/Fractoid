import type {
  AnalyserConfig,
  GraphicEqFrequency,
  PlaythroughType,
  AudioChannel,
} from '@/types'

export const AUDIO_CHANNELS: {
  [name: string]: AudioChannel
} = {
  SUB_BASS: 0,
  BASS: 1,
  LOW_MID: 2,
  MID: 3,
  HIGH_MID: 4,
  PRESENCE: 5,
  BRILLIANCE: 6,
}

export const AUDIO_SPECTRUM_RANGE = {
  [AUDIO_CHANNELS.SUB_BASS]: [16, 60],
  [AUDIO_CHANNELS.BASS]: [60, 250],
  [AUDIO_CHANNELS.LOW_MID]: [250, 500],
  [AUDIO_CHANNELS.MID]: [500, 2000],
  [AUDIO_CHANNELS.HIGH_MID]: [2000, 4000],
  [AUDIO_CHANNELS.PRESENCE]: [4000, 6000],
  [AUDIO_CHANNELS.BRILLIANCE]: [6000, 16000],
}

export const GRAPHIC_EQ_FREQUENCIES: GraphicEqFrequency[] = [
  32, 64, 128, 256, 512, 1000, 2000, 4000, 8000, 10000, 13000, 16000,
]

export const AUDIO_CORE_EVENTS = {
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

export const AUDIO_CONTROLLER_EVENTS = {
  loading: 'loading',
  loaded: 'loaded',
  skip: 'skip',
  shuffle: 'shuffle',
  unshuffle: 'unshuffle',
  trackChange: 'trachChange',
}

export const PLAYTHROUGH_OPTIONS: PlaythroughType[] = [
  'repeat',
  'repeat_one',
  'shuffle',
]

export const TRACK_URL_BASE = 'https://assets.codepen.io/544318/'

export const TRACK_LIST_DEFAULT = [
  `${TRACK_URL_BASE}Bad_Snacks_New_Moon.mp3`,
  `${TRACK_URL_BASE}Dan_Henig_Subway_Dreams.mp3`,
  `${TRACK_URL_BASE}Dyalla_Ebb_and_Flow.mp3`,
  `${TRACK_URL_BASE}Eveningland_Lost_Time.mp3`,
  `${TRACK_URL_BASE}JVNA_Stars.mp3`,
]

export const AUDIO_CONFIG_DEFAULT = {
  fileClientBaseUrl: TRACK_URL_BASE,
  maxDb: -10,
  minDb: -140,
  smoothingTimeConstant: 0.85,
  fftSize: 2048,
  startVolume: 0.8,
}

export const ANALYSER_CONFIG_DEFAULT: AnalyserConfig = {
  fftSize: 2048,
  maxDecibels: -10,
  minDecibels: -140,
  smoothingTimeConstant: 0.975,
}

export const VOLUME_TYPES = [
  'volume_off',
  'volume_mute',
  'volume_down',
  'volume_up',
]
