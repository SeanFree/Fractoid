import { defu } from 'defu'
import { SHADER_OPTIONS_DEFAULT, UNIFORMS_DEFAULT } from '~/consts'
import type {
  CustomEventHandler,
  ShaderProgramAttributes,
  ShaderProgramOptions,
  ShaderProgramCreateResult,
  ShaderProgramParams,
  ShaderProgramUniform,
  ShaderProgramUniforms,
} from '~/types'

import { EventEmitter } from './EventEmitter'

type RenderEvent = 'afterRender' | 'beforeRender'
type ShaderEvent = RenderEvent | 'destroy'
type RenderHook = CustomEventHandler<ShaderProgram>

export class ShaderProgram extends EventEmitter<ShaderEvent> {
  private currentFrame: number
  private afterRenderHooks: RenderHook[]
  private beforeRenderHooks: RenderHook[]
  private cTime: number
  private time: number
  private resizeObserver?: ResizeObserver
  private parent: HTMLElement

  readonly $animate?: FrameRequestCallback
  readonly canvas: HTMLCanvasElement
  readonly program?: WebGLProgram
  readonly attributes: ShaderProgramAttributes
  readonly config: ShaderProgramOptions
  readonly gl: WebGL2RenderingContext
  readonly uniforms: ShaderProgramUniforms

  constructor({
    gl,
    fragSource,
    vertSource,
    uniforms = {},
    options = {},
  }: ShaderProgramParams) {
    super()

    this.config = defu(
      options,
      SHADER_OPTIONS_DEFAULT
    ) as Required<ShaderProgramOptions>

    const { animate, attachTo, autoResize, height, width, canvasStyle } =
      this.config

    this.parent = attachTo!

    this.afterRenderHooks = []
    this.attributes = {}
    this.beforeRenderHooks = []
    this.currentFrame = 0
    this.time = 0
    this.cTime = 0
    this.uniforms = {}

    if (gl) {
      this.canvas = gl.canvas as HTMLCanvasElement
      this.gl = gl
    } else {
      this.canvas = document.createElement('canvas')
      this.gl = this.canvas.getContext('webgl2', {
        preserveDrawingBuffer: true,
      }) as WebGL2RenderingContext

      this.parent.insertBefore(this.canvas, this.parent.firstChild)
    }

    for (const key in canvasStyle!) {
      this.canvas.style[key] = canvasStyle[key]!
    }

    const program = this.createProgram(
      this.gl,
      vertSource,
      fragSource
    ) as ShaderProgramCreateResult

    if (!program) return

    this.program = program

    this.initPosition()

    this.addUniforms(defu(uniforms, UNIFORMS_DEFAULT))

    this.resizeCanvas(width!, height!)

    this.$animate = this.animate.bind(this)

    if (autoResize) {
      this.resizeObserver = new ResizeObserver(() => {
        this.resizeCanvas(window.innerWidth, window.innerHeight)
      })

      this.resizeObserver.observe(this.parent)
    }

    if (animate) {
      this.$animate(0)
    }
  }

  get beforeRender() {
    return this.beforeRenderHooks.length > 0
  }

  get afterRender() {
    return this.afterRenderHooks.length > 0
  }

  createShader(
    gl: WebGL2RenderingContext,
    type:
      | WebGL2RenderingContext['FRAGMENT_SHADER']
      | WebGL2RenderingContext['VERTEX_SHADER'],
    source: string
  ): WebGLShader | null {
    const shader = gl.createShader(type) as WebGLShader

    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(
        'An error occurred compiling the shader:',
        gl.getShaderInfoLog(shader)
      )
      gl.deleteShader(shader)

      return null
    }

    return shader
  }

  createProgram(
    gl: WebGL2RenderingContext,
    vs: string,
    fs: string
  ): WebGLProgram | null {
    const program = this.gl.createProgram() as WebGLProgram
    const vert = this.createShader(gl, gl.VERTEX_SHADER, vs) as WebGLShader
    const frag = this.createShader(gl, gl.FRAGMENT_SHADER, fs) as WebGLShader

    gl.attachShader(program, vert)
    gl.attachShader(program, frag)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(
        'Unable to initialize the shader program',
        gl.getProgramInfoLog(program)
      )

      return null
    }

    gl.useProgram(program)

    return program
  }

  initPosition(): void {
    const location = this.gl.getAttribLocation(this.program!, 'aPosition')
    const buffer = this.gl.createBuffer() as WebGLBuffer
    const vertexSize = 2
    const positions = new Float32Array([1, 1, -1, 1, 1, -1, -1, -1])

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer)
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(positions),
      this.gl.STATIC_DRAW
    )
    this.gl.enableVertexAttribArray(location)
    this.gl.vertexAttribPointer(
      location,
      vertexSize,
      this.gl.FLOAT,
      false,
      0,
      0
    )

    this.attributes.aPosition = {
      buffer,
      location,
    }
  }

  addUniform(
    name: string,
    type: ShaderProgramUniform['type'],
    value?: ShaderProgramUniform['value']
  ): void {
    const location = this.gl.getUniformLocation(
      this.program!,
      name
    ) as WebGLUniformLocation

    this.uniforms[name] = {
      location,
      type,
      value,
    }

    if (value) {
      this.setUniform(name, value)
    }
  }

  addUniforms(uniforms: ShaderProgramUniforms): void {
    for (const name in uniforms) {
      const { type, value } = uniforms[name]!

      this.addUniform(name, type, value)
    }
  }

  setUniform(name: string, value: ShaderProgramUniform['value']): void {
    if (!this.uniforms[name]) return

    const { location, type } = this.uniforms[name]

    this[`uniform${type}`](location as WebGLUniformLocation, value as never) // @todo: fix typing

    this.uniforms[name]!.value = value
  }

  uniform1f(location: WebGLUniformLocation, value: GLint): void {
    this.gl.uniform1f(location, value)
  }

  uniform1fv(location: WebGLUniformLocation, value: [GLint]): void {
    this.gl.uniform1fv(location, value)
  }

  uniform1i(location: WebGLUniformLocation, value: GLint): void {
    this.gl.uniform1i(location, value)
  }

  uniform1iv(location: WebGLUniformLocation, value: [GLint]): void {
    this.gl.uniform1iv(location, value)
  }

  uniform2f(location: WebGLUniformLocation, value: [GLfloat, GLfloat]): void {
    this.gl.uniform2f(location, ...value)
  }

  uniform2fv(location: WebGLUniformLocation, value: [GLfloat, GLfloat]): void {
    this.gl.uniform2fv(location, value)
  }

  uniform2i(location: WebGLUniformLocation, value: [GLfloat, GLfloat]): void {
    this.gl.uniform2i(location, ...value)
  }

  uniform2iv(location: WebGLUniformLocation, value: [GLfloat, GLfloat]): void {
    this.gl.uniform2iv(location, value)
  }

  uniform3f(
    location: WebGLUniformLocation,
    value: [GLfloat, GLfloat, GLfloat]
  ): void {
    this.gl.uniform3f(location, ...value)
  }

  uniform3fv(
    location: WebGLUniformLocation,
    value: [GLfloat, GLfloat, GLfloat]
  ): void {
    this.gl.uniform3fv(location, value)
  }

  uniform3i(
    location: WebGLUniformLocation,
    value: [GLfloat, GLfloat, GLfloat]
  ): void {
    this.gl.uniform3i(location, ...value)
  }

  uniform3iv(
    location: WebGLUniformLocation,
    value: [GLfloat, GLfloat, GLfloat]
  ): void {
    this.gl.uniform3iv(location, value)
  }

  uniform4f(
    location: WebGLUniformLocation,
    value: [GLfloat, GLfloat, GLfloat, GLfloat]
  ): void {
    this.gl.uniform4f(location, ...value)
  }

  uniform4fv(
    location: WebGLUniformLocation,
    value: [GLfloat, GLfloat, GLfloat, GLfloat]
  ): void {
    this.gl.uniform4fv(location, value)
  }

  uniform4i(
    location: WebGLUniformLocation,
    value: [GLfloat, GLfloat, GLfloat, GLfloat]
  ): void {
    this.gl.uniform4i(location, ...value)
  }

  uniform4iv(
    location: WebGLUniformLocation,
    value: [GLfloat, GLfloat, GLfloat, GLfloat]
  ): void {
    this.gl.uniform4iv(location, value)
  }

  animate(): void {
    this.currentFrame = window.requestAnimationFrame(this.$animate!)

    this.render()
  }

  stop(): void {
    if (this.currentFrame) {
      window.cancelAnimationFrame(this.currentFrame)

      this.currentFrame = 0
    }
  }

  destroy(): void {
    this.stop()

    this.gl.deleteProgram(this.program!)
    this.parent.removeChild(this.canvas)
    this.resizeObserver?.disconnect()

    this.emit('destroy')
  }

  render() {
    try {
      this.emit('beforeRender')

      this.time++
      this.setUniform('uTime', this.time)

      if (this.uniforms['uTimeUpdateC']?.value === 1) {
        this.cTime++
        this.setUniform('uCTime', this.cTime)
      }

      this.gl.clearColor(0, 0, 0, 1)
      this.gl.clear(this.gl.COLOR_BUFFER_BIT)
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4)

      this.emit('afterRender')
    } catch (e) {
      console.error(e)

      this.stop()
    }
  }

  resizeCanvas(width: number, height: number): void {
    this.canvas.width = width
    this.canvas.height = height

    this.setUniform('uResolution', [this.canvas.width, this.canvas.height])
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)

    this.render()
  }
}
