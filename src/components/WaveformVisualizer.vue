<template>
  <canvas class="rounded-borders glass" ref="cWaveform" />
</template>

<script lang="ts" setup>
import { useAudioStore } from '@/stores/audio'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const audio = useAudioStore()

const props = defineProps({
  animate: Boolean,
})

const cWaveform = ref<HTMLCanvasElement>()
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

watch(props, () => {
  if (props.animate) {
    animate()
  } else {
    pause()
  }
})

onMounted(() => {
  ctx.value = (cWaveform.value as HTMLCanvasElement).getContext(
    '2d'
  ) as CanvasRenderingContext2D
})

onBeforeUnmount(() => {
  window.cancelAnimationFrame(currentFrame.value as number)
})
</script>
