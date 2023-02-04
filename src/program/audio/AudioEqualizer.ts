import { GRAPHIC_EQ_FREQUENCIES } from '@/consts'

export class AudioEqualizer {
  head!: BiquadFilterNode
  tail!: BiquadFilterNode
  private filters: {
    [key: number | string]: BiquadFilterNode
  } = {}

  constructor(ctx: AudioContext) {
    let node: BiquadFilterNode

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
        node.connect(this.filters[GRAPHIC_EQ_FREQUENCIES[i - 1]])
      }

      this.filters[frequency] = node
    })
  }

  setGain(frequency: number, gain: number): void {
    if (this.filters[frequency]) {
      this.filters[frequency].gain.value = gain
    } else {
      console.warn(`Invalid frequency ${frequency}`)
    }
  }

  getGain(frequency: number): number {
    return this.filters[frequency].gain.value
  }

  connect(node: AudioNode) {
    return node.connect(this.tail)
  }
}
