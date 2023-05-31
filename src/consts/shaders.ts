import type { ShaderProgramConfig, ShaderProgramUniforms } from '@/types'

export const SHADER_CONFIG_DEFAULT: ShaderProgramConfig = {
  animate: false,
  attachTo: document.body,
  autoResize: false,
  height: 500,
  render: true,
  width: 500,
}

export const UNIFORMS_DEFAULT: ShaderProgramUniforms = {
  uResolution: {
    type: '2fv',
    value: [SHADER_CONFIG_DEFAULT.width, SHADER_CONFIG_DEFAULT.height],
  },
  uTime: {
    type: '1f',
    value: 0,
  },
  uTranslate: {
    type: '2fv',
    value: [0, 0],
  },
}

export const RENDER_HOOK_TYPES = {
  afterRender: 'afterRender',
  beforeRender: 'beforeRender',
}

export const SHADER_PROGRAM_EVENTS = {
  ...RENDER_HOOK_TYPES,
  destroy: 'destroy',
}

export const APP_UNIFORMS: ShaderProgramUniforms = {
  uRotateScene: {
    type: '1i',
    value: 1,
  },
  uRotateC: {
    type: '1i',
    value: 1,
  },
  uTimeUpdateC: {
    type: '1i',
    value: 0,
  },
  uC: {
    type: '2fv',
    value: [-0.302, 0.672],
  },
  uCTime: {
    type: '1f',
    value: 0,
  },
  uCRotateRange: {
    type: '1f',
    value: 0.756,
  },
  uCRotateBase: {
    type: '1f',
    value: 1,
  },
  uZMax: {
    type: '1f',
    value: 1,
  },
  uScaleEnabled: {
    type: '1i',
    value: 1,
  },
  uScaleBase: {
    type: '1f',
    value: 0.38,
  },
  uScaleRange: {
    type: '1f',
    value: 0.62,
  },
  uTimeUpdateHue: {
    type: '1i',
    value: 1,
  },
  uHueBase: {
    type: '1f',
    value: 0.225,
  },
  uHueMultiplier: {
    type: '1f',
    value: 0.012,
  },
  uHueRange: {
    type: '1f',
    value: 0.217,
  },
  uSaturationBase: {
    type: '1f',
    value: 0.45,
  },
  uSaturationRange: {
    type: '1f',
    value: 0.68,
  },
  uLightnessBase: {
    type: '1f',
    value: 0.15,
  },
  uLightnessRange: {
    type: '1f',
    value: 0.61,
  },
  uGlow: {
    type: '1i',
    value: 1,
  },
  uGlowIntensity: {
    type: '1f',
    value: 0.391,
  },
  uSmoothShading: {
    type: '1i',
    value: 1,
  },
  uSubBass: {
    type: '1f',
    value: 0,
  },
  uBass: {
    type: '1f',
    value: 0,
  },
  uLowMid: {
    type: '1f',
    value: 0,
  },
  uMid: {
    type: '1f',
    value: 0,
  },
  uHighMid: {
    type: '1f',
    value: 0,
  },
  uPresence: {
    type: '1f',
    value: 0,
  },
  uBrilliance: {
    type: '1f',
    value: 0,
  },
}
