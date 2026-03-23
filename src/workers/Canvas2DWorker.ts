/// <reference lib="webworker" />

export type CanvasCreateMessage = Required<
  WorkerMessage<
    'create',
    {
      canvas: OffscreenCanvas
    }
  >
>
export type CanvasStartMessage = WorkerMessage<'start'>
export type CanvasPauseMessage = WorkerMessage<'pause'>

export type FillColor = CanvasFillStrokeStyles['fillStyle']

export type DrawSegmentsArgs = {
  lineWidth: number
  color: CanvasFillStrokeStyles['strokeStyle']
  points: [number, number][]
}

export type FillArgs = {
  color: FillColor
  x1: number
  y1: number
  x2: number
  y2: number
}

export type StrokeColor = CanvasFillStrokeStyles['strokeStyle']

export type CanvasWorkerOptions = {
  canvas?: OffscreenCanvas
  clearColor?: FillColor
}

export type CanvasMessage =
  | CanvasCreateMessage
  | CanvasStartMessage
  | CanvasPauseMessage

export abstract class Canvas2DWorker {
  private frameId: number = -1

  protected ctx: OffscreenCanvasRenderingContext2D | null = null
  protected abstract draw(time: number): void

  readonly options: CanvasWorkerOptions = {}

  constructor(options?: CanvasWorkerOptions) {
    this.options = options ?? {}

    if (options?.canvas) this.ctx = options.canvas.getContext('2d')!

    addEventListener('message', this.onMessage)
  }

  private onMessage = ({ data }: MessageEvent<CanvasMessage>) => {
    switch (data.type) {
      case 'create':
        this.create(data.payload)
        break
      case 'start':
        this.start()
        break
      case 'pause':
        this.pause()
        break
      default:
        break
    }
  }

  private create({ canvas }: CanvasCreateMessage['payload']) {
    this.ctx = canvas.getContext('2d')!
  }

  private run = (time: number) => {
    if (!this.ctx)
      throw new Error('Canvas2DWorker: ctx has not been initialized')

    this.frameId = requestAnimationFrame(this.run)
    this.draw(time)
  }

  pause() {
    if (!this.ctx)
      throw new Error('Canvas2DWorker: ctx has not been initialized')

    cancelAnimationFrame(this.frameId)
  }

  start() {
    if (!this.ctx)
      throw new Error('Canvas2DWorker: ctx has not been initialized')

    this.run(0)
  }

  clear(x1: number, y1: number, x2: number, y2: number) {
    if (!this.ctx)
      throw new Error('Canvas2DWorker: ctx has not been initialized')

    this.ctx.clearRect(x1, y1, x2, y2)

    if (this.options.clearColor) {
      this.fill(
        {
          color: this.options.clearColor,
          x1,
          x2,
          y1,
          y2,
        },
        true
      )
    }
  }

  fill({ color, x1, y1, x2, y2 }: FillArgs, preserveContext = false) {
    if (!this.ctx)
      throw new Error('Canvas2DWorker: ctx has not been initialized')

    if (preserveContext) this.ctx.save()

    this.ctx.fillStyle = color
    this.ctx.fillRect(x1, y1, x2, y2)

    if (preserveContext) this.ctx.restore()
  }

  drawSegments(
    { lineWidth, color, points }: DrawSegmentsArgs,
    preserveContext = false
  ) {
    if (!this.ctx)
      throw new Error('Canvas2DWorker: ctx has not been initialized')

    if (preserveContext) this.ctx.save()

    this.ctx.lineWidth = lineWidth
    this.ctx.strokeStyle = color
    this.ctx.beginPath()

    points.forEach(([x, y], i) => {
      if (i === 0) {
        this.ctx!.moveTo(x, y)
      } else {
        this.ctx!.lineTo(x, y)
      }
    })

    this.ctx.stroke()

    if (preserveContext) this.ctx.restore()
  }
}
