import { toBinRange } from '@/utils'
import { AUDIO_CHANNELS, AUDIO_SPECTRUM_RANGE } from '@/consts'
import type { AudioChannelID } from '@/types'

export class AudioSpectrum {
  readonly subBass: [number, number]
  readonly subBassWidth: number
  readonly bass: [number, number]
  readonly bassWidth: number
  readonly lowMid: [number, number]
  readonly lowMidWidth: number
  readonly mid: [number, number]
  readonly midWidth: number
  readonly highMid: [number, number]
  readonly highMidWidth: number
  readonly presence: [number, number]
  readonly presenceWidth: number
  readonly brilliance: [number, number]
  readonly brillianceWidth: number

  constructor(analyser: AnalyserNode, nyquist: number) {
    const bins = (channel: AudioChannelID) =>
      toBinRange(
        AUDIO_SPECTRUM_RANGE[channel],
        nyquist,
        analyser.frequencyBinCount
      )

    this.subBass = bins(AUDIO_CHANNELS.SUB_BASS)
    this.subBassWidth = this.subBass[1] - this.subBass[0]

    this.bass = bins(AUDIO_CHANNELS.BASS)
    this.bassWidth = this.bass[1] - this.bass[0]

    this.lowMid = bins(AUDIO_CHANNELS.LOW_MID)
    this.lowMidWidth = this.lowMid[1] - this.lowMid[0]

    this.mid = bins(AUDIO_CHANNELS.MID)
    this.midWidth = this.mid[1] - this.mid[0]

    this.highMid = bins(AUDIO_CHANNELS.HIGH_MID)
    this.highMidWidth = this.highMid[1] - this.highMid[0]

    this.presence = bins(AUDIO_CHANNELS.PRESENCE)
    this.presenceWidth = this.presence[1] - this.presence[0]

    this.brilliance = bins(AUDIO_CHANNELS.BRILLIANCE)
    this.brillianceWidth = this.brilliance[1] - this.brilliance[0]
  }
}
