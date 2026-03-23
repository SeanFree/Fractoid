/// <reference lib="webworker" />

import type {
  CanvasCreateMessage,
  CanvasMessage,
  CanvasWorkerOptions,
} from './Canvas2DWorker'

export type UniformType =
  | '1f'
  | '1fv'
  | '1i'
  | '1iv'
  | '2f'
  | '2fv'
  | '2i'
  | '2iv'
  | '3f'
  | '3fv'
  | '3i'
  | '3iv'
  | '4f'
  | '4fv'
  | '4i'
  | '4iv'
  | 'Matrix2fv'
  | 'Matrix3fv'
  | 'Matrix4fv'

export interface UniformArg extends Record<keyof UniformType, []> {
  '1f': number
  '1fv': [number]
  '1i': number
  '1iv': [number]
  '2f': [number, number]
  '2fv': [number, number]
  '2i': [number, number]
  '2iv': [number, number]
  '3f': [number, number, number]
  '3fv': [number, number, number]
  '3i': [number, number, number]
  '3iv': [number, number, number]
  '4f': [number, number, number, number]
  '4fv': [number, number, number, number]
  '4i': [number, number, number, number]
  '4iv': [number, number, number, number]
}

type GLUniformMethod = `uniform${UniformType}`

export interface Uniform<T extends UniformType> {
  location?: WebGLUniformLocation
  type: T
  value?: UniformArg[T]
}

export abstract class CanvasGLWorker {
  private frameId: number = -1

  protected gl: WebGL2RenderingContext | null = null
  protected program: WebGLProgram | null = null
  protected abstract draw(time: number): void

  readonly options: CanvasWorkerOptions = {}

  constructor(options?: CanvasWorkerOptions) {
    this.options = options ?? {}

    if (options?.canvas) this.gl = options.canvas.getContext('webgl2')

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
    this.gl = canvas.getContext('webgl2')!
  }

  private run = (time: number) => {
    if (!this.gl)
      throw new Error('Canvas2DWorker: ctx has not been initialized')

    this.frameId = requestAnimationFrame(this.run)
    this.draw(time)
  }

  pause() {
    if (!this.gl)
      throw new Error('Canvas2DWorker: ctx has not been initialized')

    cancelAnimationFrame(this.frameId)
  }

  start() {
    if (!this.gl)
      throw new Error('Canvas2DWorker: ctx has not been initialized')

    this.run(0)
  }
}
