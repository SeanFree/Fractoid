/// <reference lib="webworker" />

import { Canvas2DWorker, type CanvasMessage } from './Canvas2DWorker'

type TimeDomainUpdateMessage = Required<
  WorkerMessage<
    'timedomainupdate',
    {
      values: Uint8Array<ArrayBuffer>
    }
  >
>

export type WaveformVisualizerMessage = CanvasMessage | TimeDomainUpdateMessage

class WaveformVisualizer extends Canvas2DWorker {
  // @ts-expect-error - will be set on audio update
  private timeDomain: number[]

  constructor() {
    super()

    addEventListener(
      'message',
      ({ data }: MessageEvent<WaveformVisualizerMessage>) => {
        if (data.type === 'timedomainupdate')
          this.setTimeDomain(data.payload.values)
      }
    )
  }

  setTimeDomain(values: Uint8Array<ArrayBuffer>) {
    this.timeDomain = [...values]
  }

  draw() {
    const { width, height } = this.ctx!.canvas
    const timeDomain = this.timeDomain || []
    const bufferLength = timeDomain?.length || 0
    const sliceWidth = width / bufferLength
    const centerY = 0.5 * height

    this.clear(0, 0, width, height)

    this.drawSegments({
      lineWidth: 2,
      color: 'rgba(38, 166, 154, 0.65)',
      points: timeDomain
        .map((v, i) => {
          const y = (v / 128) * centerY

          return [sliceWidth * i, y] as [number, number]
        })
        .concat([[width, centerY]] as [number, number][]),
    })
  }
}

new WaveformVisualizer()
