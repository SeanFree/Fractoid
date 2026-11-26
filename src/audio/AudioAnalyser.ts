import type { AnalyserConfig, AudioBinRange, AudioBandRanges } from '@/types'
import { ANALYSER_CONFIG_DEFAULT } from '@/consts'
import { getBinRanges } from '@/utils'

export class AudioAnalyser {
  readonly analyser: AnalyserNode
  readonly nyquist: number
  readonly freqDomain: Uint8Array<ArrayBuffer>
  readonly timeDomain: Uint8Array<ArrayBuffer>
  readonly bandRanges: AudioBandRanges
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

    this.bandRanges = getBinRanges(
      this.nyquist,
      this.analyser.frequencyBinCount
    )
  }

  get node(): AnalyserNode {
    return this.analyser
  }

  get binCount(): number {
    return this.analyser.frequencyBinCount
  }

  get subBass(): number {
    return this.bandAverage(this.bandRanges.SUB_BASS)
  }

  get bass(): number {
    return this.bandAverage(this.bandRanges.BASS)
  }

  get lowMid(): number {
    return this.bandAverage(this.bandRanges.LOW_MID)
  }

  get mid(): number {
    return this.bandAverage(this.bandRanges.MID)
  }

  get highMid(): number {
    return this.bandAverage(this.bandRanges.HIGH_MID)
  }

  get presence(): number {
    return this.bandAverage(this.bandRanges.PRESENCE)
  }

  get brilliance(): number {
    return this.bandAverage(this.bandRanges.BRILLIANCE)
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

  private bandAverage([start, end, bandWidth]: AudioBinRange): number {
    let sum = 0

    for (let i = start; i < end; i++) {
      sum += this.freqDomain[i] ?? 0
    }

    return sum / bandWidth
  }
}
