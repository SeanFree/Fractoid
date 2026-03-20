import type { GraphicEqFrequency, GraphicEqPreset } from '@/types/audio'
import { GRAPHIC_EQ_FLAT, GRAPHIC_EQ_FREQUENCIES } from '@/consts'

export class GraphicEqualizer {
  head!: BiquadFilterNode
  tail!: BiquadFilterNode

  private filters: Record<GraphicEqFrequency, BiquadFilterNode>

  constructor(ctx: AudioContext) {
    let node: BiquadFilterNode

    const filters: Partial<Record<GraphicEqFrequency, BiquadFilterNode>> = {}

    GRAPHIC_EQ_FREQUENCIES.forEach((frequency, i) => {
      node = ctx.createBiquadFilter()
      node.frequency.value = frequency

      if (i === 0) {
        node.type = 'lowshelf'
        this.tail = node
      } else if (i === GRAPHIC_EQ_FREQUENCIES.length - 1) {
        node.type = 'highshelf'
        this.head = node
      } else {
        node.type = 'peaking'
      }

      if (i > 0) {
        node.connect(this.filters[GRAPHIC_EQ_FREQUENCIES[i - 1]!])
      }

      filters[frequency] = node
    })

    this.filters = filters as Required<
      Record<GraphicEqFrequency, BiquadFilterNode>
    >
  }

  get preset(): GraphicEqPreset {
    const preset = { ...GRAPHIC_EQ_FLAT }

    for (const frequency in this.filters) {
      preset[Number(frequency) as GraphicEqFrequency] = this.getGain(
        Number(frequency) as GraphicEqFrequency
      )
    }

    return preset
  }

  setGain(frequency: GraphicEqFrequency, gain: number): void {
    if (this.filters[frequency]) {
      this.filters[frequency].gain.value = gain
    } else {
      console.warn(`Invalid frequency ${frequency}`)
    }
  }

  getGain(frequency: GraphicEqFrequency): number {
    return this.filters[frequency].gain.value
  }

  connect(node: AudioNode) {
    return node.connect(this.tail)
  }
}
