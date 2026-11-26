import { AudioSpectrum } from '@/audio'
import type { AnalyserConfig } from '@/types'
import { ANALYSER_CONFIG_DEFAULT } from '@/consts'

export class AudioAnalyser {
  readonly analyser: AnalyserNode
  readonly nyquist: number
  readonly freqDomain: Uint8Array<ArrayBuffer>
  readonly timeDomain: Uint8Array<ArrayBuffer>
  private spectrum: AudioSpectrum
  private ctx: AudioContext
  private config: AnalyserConfig

  constructor(ctx: AudioContext, config?: Partial<AnalyserConfig>) {
    this.ctx = ctx
    this.config = {
      ...ANALYSER_CONFIG_DEFAULT,
      ...config,
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

  get subBass(): number {
    return this.bandAverage(this.spectrum.subBass, this.spectrum.subBassWidth)
  }

  get bass(): number {
    return this.bandAverage(this.spectrum.bass, this.spectrum.bassWidth)
  }

  get lowMid(): number {
    return this.bandAverage(this.spectrum.lowMid, this.spectrum.lowMidWidth)
  }

  get mid(): number {
    return this.bandAverage(this.spectrum.mid, this.spectrum.midWidth)
  }

  get highMid(): number {
    return this.bandAverage(this.spectrum.highMid, this.spectrum.highMidWidth)
  }

  get presence(): number {
    return this.bandAverage(this.spectrum.presence, this.spectrum.presenceWidth)
  }

  get brilliance(): number {
    return this.bandAverage(
      this.spectrum.brilliance,
      this.spectrum.brillianceWidth
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
    return this.freqDomain[((i / this.nyquist) * this.freqDomain.length) | 0]!
  }

  private bandAverage([start, end]: [number, number], width: number): number {
    let sum = 0

    for (let i = start; i < end; i++) {
      sum += this.freqDomain[i] ?? 0
    }

    return sum / width
  }
}
