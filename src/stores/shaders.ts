import type { ShaderProgramUniform, ShaderProgramUniforms } from '@/types'

import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import { APP_UNIFORMS, RENDER_HOOK_TYPES } from '@/consts'
import { ShaderProgram } from '@/program'

export const useShadersStore = defineStore('shaders', () => {
  const program = ref<ShaderProgram>()

  const uniforms = reactive<ShaderProgramUniforms>(APP_UNIFORMS)

  const create = (
    fragSource: string,
    vertSource: string,
    parent?: HTMLElement
  ): void => {
    if (!program.value) {
      program.value = new ShaderProgram({
        fragSource,
        vertSource,
        uniforms,
        config: {
          animate: true,
          attachTo: parent,
          autoResize: true,
          height: window.innerHeight,
          width: window.innerWidth,
        },
      })
    }
  }

  const getUniform = (
    name: string,
    transform: (value: ShaderProgramUniform['value']) => unknown = (value) =>
      value
  ) => {
    return transform(program.value?.uniforms?.[name]?.value)
  }

  const setUniform = (name: string, value: ShaderProgramUniform['value']) => {
    program.value!.setUniform(name, value)
    uniforms[name].value = value
  }

  return {
    create,
    program,
    uniforms,
    getUniform,
    setUniform,
    on(
      when = RENDER_HOOK_TYPES.beforeRender,
      fn: (...args: unknown[]) => unknown
    ) {
      program.value!.on(when, fn)
    },
    off(
      when = RENDER_HOOK_TYPES.beforeRender,
      fn: (...args: unknown[]) => unknown
    ) {
      program.value!.off(when, fn)
    },
  }
})
