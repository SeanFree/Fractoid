<template>
  <canvas class="WaveformVisualizer glass fit" ref="canvas" />
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useAudioStore } from '@/stores/audio'
import { useModalsStore } from '@/stores/modals'

const audio = useAudioStore()
const modals = useModalsStore()

const canvas = ref<HTMLCanvasElement>()
const ctx = ref<CanvasRenderingContext2D>()
const currentFrame = ref<number>()

const animate = () => {
  currentFrame.value = window.requestAnimationFrame(animate)

  const { width, height } = ctx.value!.canvas.getBoundingClientRect()

  const timeDomain = audio.controller?.analyser.timeDomain || []
  const bufferLength = timeDomain?.length || 0
  const sliceWidth = width / bufferLength
  const centerY = 0.5 * height

  ctx.value!.clearRect(0, 0, width, height)

  ctx.value!.lineWidth = 2
  ctx.value!.strokeStyle = 'rgba(38, 166, 154, 0.65)'
  ctx.value!.beginPath()

  timeDomain.forEach((v, i) => {
    const y = (v / 128) * centerY

    if (i === 0) {
      ctx.value!.moveTo(sliceWidth * i, y)
    } else {
      ctx.value!.lineTo(sliceWidth * i, y)
    }
  })

  ctx.value!.lineTo(width, centerY)
  ctx.value!.stroke()
}

const pause = () => window.cancelAnimationFrame(currentFrame.value as number)

onMounted(() => {
  ctx.value = (canvas.value as HTMLCanvasElement).getContext(
    '2d'
  ) as CanvasRenderingContext2D

  modals.onShow('eq', animate)
  modals.onHide('eq', pause)

  animate()
})

onBeforeUnmount(() => {
  window.cancelAnimationFrame(currentFrame.value as number)
})
</script>

<style lang="scss">
.WaveformVisualizer {
  border-radius: 4px;
}
</style>
