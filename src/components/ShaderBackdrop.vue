<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useShadersStore } from '@/stores/shaders'
import { useAudioStore } from '@/stores/audio'
import { AUDIO_CHANNELS, RENDER_HOOK_TYPES } from '@/consts'
import fragSource from '@/shaders/julia.frag?raw'
import vertSource from '@/shaders/julia.vert?raw'

const shaders = useShadersStore()
const audio = useAudioStore()

const parent = ref<HTMLDivElement>()
const unsubscribeHandler = ref<() => void>()

const beforeRender = () => {
  const program = shaders.program

  audio.updateAnalyser()

  program?.setUniform(
    'uSubBass',
    audio.getChannelValue(AUDIO_CHANNELS.SUB_BASS, true)
  )
  program?.setUniform('uBass', audio.getChannelValue(AUDIO_CHANNELS.BASS, true))
  program?.setUniform(
    'uLowMid',
    audio.getChannelValue(AUDIO_CHANNELS.LOW_MID, true)
  )
  program?.setUniform('uMid', audio.getChannelValue(AUDIO_CHANNELS.MID, true))
  program?.setUniform(
    'uHighMid',
    audio.getChannelValue(AUDIO_CHANNELS.HIGH_MID, true)
  )
  program?.setUniform(
    'uPresence',
    audio.getChannelValue(AUDIO_CHANNELS.PRESENCE, true)
  )
  program?.setUniform(
    'uBrilliance',
    audio.getChannelValue(AUDIO_CHANNELS.BRILLIANCE, true)
  )
}

onMounted(() => {
  shaders.create(fragSource, vertSource, parent.value)

  unsubscribeHandler.value = shaders.program?.on(
    RENDER_HOOK_TYPES.beforeRender,
    beforeRender
  )
})

onBeforeUnmount(() => {
  unsubscribeHandler.value?.()
  shaders.destroy()
  audio.disconnect()
})
</script>

<template>
  <div class="ShaderBackdrop" ref="parent" />
</template>

<style lang="scss" scoped>
.ShaderBackdrop {
  height: 100vh;
  left: 0;
  position: absolute;
  top: 0;
  width: 100vw;
}
</style>
