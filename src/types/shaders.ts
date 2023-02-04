import type { APP_UNIFORMS } from '@/consts/shaders'
import type { CustomEventHandler, ValueOf } from '@/types'

export interface ShaderProgramConfig {
  animate: boolean
  attachTo: HTMLElement
  autoResize: boolean
  gl?: WebGL2RenderingContext
  height: number
  render: boolean
  width: number
}

export interface ShaderProgramAttribute {
  buffer: WebGLBuffer
  location: number
}

export interface ShaderProgramAttributes {
  [name: string]: ShaderProgramAttribute
}

export interface ShaderProgramUniformType {
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

export interface ShaderProgramUniform {
  location?: WebGLUniformLocation
  type: keyof ShaderProgramUniformType
  value?: ValueOf<ShaderProgramUniformType>
}

export interface ShaderProgramUniforms {
  [name: string]: ShaderProgramUniform
}

export interface ShaderProgramCreateResult {
  frag: WebGLShader
  program: WebGLProgram
  vert: WebGLShader
}

export interface ShaderProgramParams {
  fragSource: string
  vertSource: string
  uniforms: ShaderProgramUniforms
  config: Partial<ShaderProgramConfig>
}

export type RenderHook = CustomEventHandler

export type AppUniformName = keyof typeof APP_UNIFORMS
