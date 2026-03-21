<template>
  <canvas class="rounded-borders glass" ref="canvas" />
</template>

<script lang="ts" setup>
import { useAudioStore } from '@/stores/audio'
import {
  onBeforeUnmount,
  onMounted,
  ref,
  useTemplateRef,
  watchEffect,
} from 'vue'
import WaveformWorker from '@/workers/WaveformVisualizer.worker?worker'
import type { WaveformVisualizerMessage } from '@/workers/WaveformVisualizer.worker'
import { useWebWorker } from '@vueuse/core'

const worker = useWebWorker<never, WaveformVisualizerMessage>(
  new WaveformWorker()
)
const canvas = useTemplateRef('canvas')
const isInitialized = ref(false)
const audio = useAudioStore()
const timeDomainFrame = ref(-1)

const props = defineProps({
  animate: Boolean,
})

const postTimeDomainUpdates = () => {
  requestAnimationFrame(postTimeDomainUpdates)

  worker.post({
    type: 'timedomainupdate',
    payload: {
      values: audio.controller?.analyser.timeDomain || new Uint8Array(),
    },
  })
}

watchEffect(() => {
  if (!isInitialized.value) return

  if (props.animate) {
    worker.post({ type: 'start' })
    postTimeDomainUpdates()
  } else {
    worker.post({ type: 'pause' })
    cancelAnimationFrame(timeDomainFrame.value)
  }
})

onMounted(() => {
  const offscreenCanvas = canvas.value!.transferControlToOffscreen()!

  worker.post(
    {
      type: 'create',
      payload: {
        canvas: offscreenCanvas,
      },
    },
    {
      transfer: [offscreenCanvas],
    }
  )

  isInitialized.value = true
})

onBeforeUnmount(() => {
  worker.post({ type: 'pause' })
  worker.terminate()
})
</script>
