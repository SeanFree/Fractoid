import type { AnalyserConfig } from '@/types'
import {
  ANALYSER_CONFIG_DEFAULT,
  AUDIO_CHANNELS,
  AUDIO_SPECTRUM_RANGE,
} from '@/consts'
import { getSpectrumWidth } from '@/utils'

export class AudioAnalyser {
  readonly analyser: AnalyserNode
  readonly nyquist: number
  readonly freqDomain: Uint8Array
  readonly subBassSpectrum: [number, number]
  readonly subBassSpectrumWidth: number
  // private timeDomain: Uint8Array
  readonly bassSpectrum: [number, number]
  readonly bassSpectrumWidth: number
  readonly lowMidSpectrum: [number, number]
  readonly lowMidSpectrumWidth: number
  readonly midSpectrum: [number, number]
  readonly midSpectrumWidth: number
  readonly highMidSpectrum: [number, number]
  readonly highMidSpectrumWidth: number
  readonly presenceSpectrum: [number, number]
  readonly presenceSpectrumWidth: number
  readonly brillianceSpectrum: [number, number]
  readonly brillianceSpectrumWidth: number
  private ctx: AudioContext
  private config: AnalyserConfig

  constructor(ctx: AudioContext, config?: Partial<AnalyserConfig>) {
    this.ctx = ctx
    this.config = {
      ...ANALYSER_CONFIG_DEFAULT,
      ...(config || {}),
    }

    this.analyser = this.ctx.createAnalyser()
    this.analyser.fftSize = this.config.fftSize
    this.analyser.maxDecibels = this.config.maxDecibels
    this.analyser.minDecibels = this.config.minDecibels
    this.analyser.smoothingTimeConstant = this.config.smoothingTimeConstant

    this.nyquist = 0.5 * this.analyser.context.sampleRate

    this.freqDomain = new Uint8Array(this.analyser.frequencyBinCount)
    // this.timeDomain = new Uint8Array(this.analyser.frequencyBinCount)

    this.subBassSpectrum = AUDIO_SPECTRUM_RANGE[AUDIO_CHANNELS.SUB_BASS].map(
      (value) =>
        getSpectrumWidth(value, this.nyquist, this.analyser.frequencyBinCount)
    ) as [number, number]
    // [
    //   getSpectrumWidth(16, this.nyquist, this.analyser.frequencyBinCount),
    //   getSpectrumWidth(60, this.nyquist, this.analyser.frequencyBinCount),
    // ]
    this.subBassSpectrumWidth =
      this.subBassSpectrum[1] - this.subBassSpectrum[0]

    this.bassSpectrum = [
      getSpectrumWidth(60, this.nyquist, this.analyser.frequencyBinCount),
      getSpectrumWidth(250, this.nyquist, this.analyser.frequencyBinCount),
    ]
    this.bassSpectrumWidth = this.bassSpectrum[1] - this.bassSpectrum[0]

    this.lowMidSpectrum = [
      getSpectrumWidth(250, this.nyquist, this.analyser.frequencyBinCount),
      getSpectrumWidth(500, this.nyquist, this.analyser.frequencyBinCount),
    ]
    this.lowMidSpectrumWidth = this.lowMidSpectrum[1] - this.lowMidSpectrum[0]

    this.midSpectrum = [
      getSpectrumWidth(500, this.nyquist, this.analyser.frequencyBinCount),
      getSpectrumWidth(2000, this.nyquist, this.analyser.frequencyBinCount),
    ]
    this.midSpectrumWidth = this.midSpectrum[1] - this.midSpectrum[0]

    this.highMidSpectrum = [
      getSpectrumWidth(2000, this.nyquist, this.analyser.frequencyBinCount),
      getSpectrumWidth(4000, this.nyquist, this.analyser.frequencyBinCount),
    ]
    this.highMidSpectrumWidth =
      this.highMidSpectrum[1] - this.highMidSpectrum[0]

    this.presenceSpectrum = [
      getSpectrumWidth(4000, this.nyquist, this.analyser.frequencyBinCount),
      getSpectrumWidth(6000, this.nyquist, this.analyser.frequencyBinCount),
    ]
    this.presenceSpectrumWidth =
      this.presenceSpectrum[1] - this.presenceSpectrum[0]

    this.brillianceSpectrum = [
      getSpectrumWidth(6000, this.nyquist, this.analyser.frequencyBinCount),
      getSpectrumWidth(24000, this.nyquist, this.analyser.frequencyBinCount),
    ]
    this.brillianceSpectrumWidth =
      this.brillianceSpectrum[1] - this.brillianceSpectrum[0]
  }

  get node(): AnalyserNode {
    return this.analyser
  }

  get binCount(): number {
    return this.analyser.frequencyBinCount
  }

  get subBass() {
    return (
      this.freqDomain.slice(...this.subBassSpectrum).reduce((a, b) => a + b) /
      this.subBassSpectrumWidth
    )
  }

  get bass() {
    return (
      this.freqDomain.slice(...this.bassSpectrum).reduce((a, b) => a + b) /
      this.bassSpectrumWidth
    )
  }

  get lowMid() {
    return (
      this.freqDomain.slice(...this.lowMidSpectrum).reduce((a, b) => a + b) /
      this.lowMidSpectrumWidth
    )
  }

  get mid() {
    return (
      this.freqDomain.slice(...this.midSpectrum).reduce((a, b) => a + b) /
      this.midSpectrumWidth
    )
  }

  get highMid() {
    return (
      this.freqDomain.slice(...this.highMidSpectrum).reduce((a, b) => a + b) /
      this.highMidSpectrumWidth
    )
  }

  get presence() {
    return (
      this.freqDomain.slice(...this.presenceSpectrum).reduce((a, b) => a + b) /
      this.presenceSpectrumWidth
    )
  }

  get brilliance() {
    return (
      this.freqDomain
        .slice(...this.brillianceSpectrum)
        .reduce((a, b) => a + b) / this.brillianceSpectrumWidth
    )
  }

  connect(node: AudioNode): AudioNode {
    return this.analyser.connect(node)
  }

  update(): void {
    this.analyser.getByteFrequencyData(this.freqDomain)
  }

  getFrequency(i: number): number {
    return this.freqDomain[((i / this.nyquist) * this.freqDomain.length) | 0]
  }
}
