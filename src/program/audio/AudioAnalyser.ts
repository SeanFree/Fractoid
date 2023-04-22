import { AudioSpectrum } from '@/program'
import type { AnalyserConfig } from '@/types'
import { ANALYSER_CONFIG_DEFAULT } from '@/consts'

export class AudioAnalyser {
  readonly analyser: AnalyserNode
  readonly nyquist: number
  readonly freqDomain: Uint8Array
  readonly timeDomain: Uint8Array
  private spectrum: AudioSpectrum
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
    this.timeDomain = new Uint8Array(this.analyser.frequencyBinCount)

    this.spectrum = new AudioSpectrum(this.analyser, this.nyquist)
  }

  get node(): AnalyserNode {
    return this.analyser
  }

  get binCount(): number {
    return this.analyser.frequencyBinCount
  }

  get subBass() {
    return (
      this.freqDomain.slice(...this.spectrum.subBass).reduce((a, b) => a + b) /
      this.spectrum.subBassWidth
    )
  }

  get bass() {
    return (
      this.freqDomain.slice(...this.spectrum.bass).reduce((a, b) => a + b) /
      this.spectrum.bassWidth
    )
  }

  get lowMid() {
    return (
      this.freqDomain.slice(...this.spectrum.lowMid).reduce((a, b) => a + b) /
      this.spectrum.lowMidWidth
    )
  }

  get mid() {
    return (
      this.freqDomain.slice(...this.spectrum.mid).reduce((a, b) => a + b) /
      this.spectrum.midWidth
    )
  }

  get highMid() {
    return (
      this.freqDomain.slice(...this.spectrum.highMid).reduce((a, b) => a + b) /
      this.spectrum.highMidWidth
    )
  }

  get presence() {
    return (
      this.freqDomain.slice(...this.spectrum.presence).reduce((a, b) => a + b) /
      this.spectrum.presenceWidth
    )
  }

  get brilliance() {
    return (
      this.freqDomain
        .slice(...this.spectrum.brilliance)
        .reduce((a, b) => a + b) / this.spectrum.brillianceWidth
    )
  }

  connect(node: AudioNode): AudioNode {
    return this.analyser.connect(node)
  }

  update(): void {
    this.analyser.getByteFrequencyData(this.freqDomain)
    this.analyser.getByteTimeDomainData(this.timeDomain)
  }

  getFrequency(i: number): number {
    return this.freqDomain[((i / this.nyquist) * this.freqDomain.length) | 0]
  }
}
