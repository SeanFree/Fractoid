<template>
  <div class="ShaderBackdrop" ref="parent" />
</template>

<script lang="ts" setup>
import type { AudioController } from '@/program'

import { ref, onMounted } from 'vue'
import { useShadersStore } from '@/stores/shaders'

import { useAudioStore } from '@/stores/audio'
import { AUDIO_CHANNELS, RENDER_HOOK_TYPES } from '@/consts'

import fragSource from '@/program/shaders/julia.frag?raw'
import vertSource from '@/program/shaders/julia.vert?raw'

const parent = ref<HTMLDivElement>()

const shaders = useShadersStore()
const audio = useAudioStore()

const beforeRender = () => {
  ;(audio.controller as AudioController)?.updateAnalyser()

  shaders.program?.setUniform(
    'uSubBass',
    (audio.controller?.getChannelValue(AUDIO_CHANNELS.SUB_BASS) as number) / 255
  )
  shaders.program?.setUniform(
    'uBass',
    (audio.controller?.getChannelValue(AUDIO_CHANNELS.BASS) as number) / 255
  )
  shaders.program?.setUniform(
    'uLowMid',
    (audio.controller?.getChannelValue(AUDIO_CHANNELS.LOW_MID) as number) / 255
  )
  shaders.program?.setUniform(
    'uMid',
    (audio.controller?.getChannelValue(AUDIO_CHANNELS.MID) as number) / 255
  )
  shaders.program?.setUniform(
    'uHighMid',
    (audio.controller?.getChannelValue(AUDIO_CHANNELS.HIGH_MID) as number) / 255
  )
  shaders.program?.setUniform(
    'uPresence',
    (audio.controller?.getChannelValue(AUDIO_CHANNELS.PRESENCE) as number) / 255
  )
  shaders.program?.setUniform(
    'uBrilliance',
    (audio.controller?.getChannelValue(AUDIO_CHANNELS.BRILLIANCE) as number) /
      255
  )
}
onMounted(() => {
  shaders.create(fragSource, vertSource, parent.value)

  shaders.program?.on(RENDER_HOOK_TYPES.beforeRender, beforeRender)
})
</script>

<style lang="scss" scoped>
.ShaderBackdrop {
  height: 100vh;
  left: 0;
  position: absolute;
  top: 0;
  width: 100vw;
}
</style>
