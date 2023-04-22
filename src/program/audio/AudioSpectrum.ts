import { getSpectrumWidth } from '@/utils'
import { AUDIO_CHANNELS, AUDIO_SPECTRUM_RANGE } from '@/consts'

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
    this.subBass = AUDIO_SPECTRUM_RANGE[AUDIO_CHANNELS.SUB_BASS].map((value) =>
      getSpectrumWidth(value, nyquist, analyser.frequencyBinCount)
    ) as [number, number]

    this.subBassWidth = this.subBass[1] - this.subBass[0]

    this.bass = AUDIO_SPECTRUM_RANGE[AUDIO_CHANNELS.BASS].map((value) =>
      getSpectrumWidth(value, nyquist, analyser.frequencyBinCount)
    ) as [number, number]
    this.bassWidth = this.bass[1] - this.bass[0]

    this.lowMid = AUDIO_SPECTRUM_RANGE[AUDIO_CHANNELS.LOW_MID].map((value) =>
      getSpectrumWidth(value, nyquist, analyser.frequencyBinCount)
    ) as [number, number]
    this.lowMidWidth = this.lowMid[1] - this.lowMid[0]

    this.mid = AUDIO_SPECTRUM_RANGE[AUDIO_CHANNELS.MID].map((value) =>
      getSpectrumWidth(value, nyquist, analyser.frequencyBinCount)
    ) as [number, number]
    this.midWidth = this.mid[1] - this.mid[0]

    this.highMid = AUDIO_SPECTRUM_RANGE[AUDIO_CHANNELS.HIGH_MID].map((value) =>
      getSpectrumWidth(value, nyquist, analyser.frequencyBinCount)
    ) as [number, number]
    this.highMidWidth = this.highMid[1] - this.highMid[0]

    this.presence = AUDIO_SPECTRUM_RANGE[AUDIO_CHANNELS.PRESENCE].map((value) =>
      getSpectrumWidth(value, nyquist, analyser.frequencyBinCount)
    ) as [number, number]
    this.presenceWidth = this.presence[1] - this.presence[0]

    this.brilliance = AUDIO_SPECTRUM_RANGE[AUDIO_CHANNELS.BRILLIANCE].map(
      (value) => getSpectrumWidth(value, nyquist, analyser.frequencyBinCount)
    ) as [number, number]
    this.brillianceWidth = this.brilliance[1] - this.brilliance[0]
  }
}
