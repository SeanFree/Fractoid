import type { ValueOf } from '@/types'
import type { ShaderProgram } from '@/core/ShaderProgram'

export interface ShaderProgramOptions {
  animate?: boolean
  attachTo?: HTMLElement
  autoResize?: boolean
  height?: number
  width?: number
  canvasStyle?: Partial<CSSStyleProperties>
}

export interface ShaderProgramAttribute {
  buffer: WebGLBuffer
  location: number
}

export interface ShaderProgramAttributes {
  [name: string]: ShaderProgramAttribute
}

export interface ShaderProgramUniformType {
  '1f': GLint
  '1fv': [GLint]
  '1i': GLint
  '1iv': [GLint]
  '2f': [GLfloat, GLfloat]
  '2fv': [GLfloat, GLfloat]
  '2i': [GLfloat, GLfloat]
  '2iv': [GLfloat, GLfloat]
  '3f': [GLfloat, GLfloat, GLfloat]
  '3fv': [GLfloat, GLfloat, GLfloat]
  '3i': [GLfloat, GLfloat, GLfloat]
  '3iv': [GLfloat, GLfloat, GLfloat]
  '4f': [GLfloat, GLfloat, GLfloat, GLfloat]
  '4fv': [GLfloat, GLfloat, GLfloat, GLfloat]
  '4i': [GLfloat, GLfloat, GLfloat, GLfloat]
  '4iv': [GLfloat, GLfloat, GLfloat, GLfloat]
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
  gl?: WebGL2RenderingContext
  fragSource: string
  vertSource: string
  uniforms?: ShaderProgramUniforms
  options?: Partial<ShaderProgramOptions>
}

export type RenderHook = (program: ShaderProgram) => void
