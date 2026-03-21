/// <reference lib="webworker" />

interface WorkerMessage<
  T extends string,
  D extends Record<string | number, unknown> = never,
> {
  type: T
  payload?: D
}

type CanvasCreateMessage = Required<
  WorkerMessage<
    'create',
    {
      canvas: OffscreenCanvas
    }
  >
>

type CanvasStartMessage = WorkerMessage<'start'>
type CanvasPauseMessage = WorkerMessage<'pause'>

type TimeDomainUpdateMessage = Required<
  WorkerMessage<
    'timedomainupdate',
    {
      values: Uint8Array<ArrayBuffer>
    }
  >
>

export type WaveformVisualizerMessage =
  | CanvasCreateMessage
  | CanvasStartMessage
  | CanvasPauseMessage
  | TimeDomainUpdateMessage

class WaveformVisualizer {
  private ctx: OffscreenCanvasRenderingContext2D
  // @ts-expect-error - will be set on audio update
  private timeDomain: Uint8Array<ArrayBuffer>
  private currentFrame: number = -1
  private $animate: () => void

  constructor(canvas: OffscreenCanvas) {
    this.ctx = canvas.getContext('2d')!

    this.$animate = this.animate.bind(this)
  }

  setTimeDomain(values: Uint8Array<ArrayBuffer>) {
    this.timeDomain = values
  }

  animate() {
    this.currentFrame = requestAnimationFrame(this.$animate)

    const { width, height } = this.ctx.canvas
    const timeDomain = this.timeDomain || []
    const bufferLength = timeDomain?.length || 0
    const sliceWidth = width / bufferLength
    const centerY = 0.5 * height

    this.ctx.clearRect(0, 0, width, height)

    this.ctx.lineWidth = 2
    this.ctx.strokeStyle = 'rgba(38, 166, 154, 0.65)'
    this.ctx.beginPath()

    timeDomain.forEach((v, i) => {
      const y = (v / 128) * centerY

      if (i === 0) {
        this.ctx.moveTo(sliceWidth * i, y)
      } else {
        this.ctx.lineTo(sliceWidth * i, y)
      }
    })

    this.ctx.lineTo(width, centerY)
    this.ctx.stroke()
  }

  pause() {
    cancelAnimationFrame(this.currentFrame)
  }
}

let waveform: WaveformVisualizer

const onMessage = ({ data }: MessageEvent<WaveformVisualizerMessage>) => {
  switch (data.type) {
    case 'create':
      waveform = new WaveformVisualizer(data.payload.canvas)
      break
    case 'start':
      waveform.animate()
      break
    case 'pause':
      waveform?.pause()
      break
    case 'timedomainupdate':
      waveform.setTimeDomain(data.payload.values)
      break
    default:
      break
  }
}

addEventListener('message', onMessage)
