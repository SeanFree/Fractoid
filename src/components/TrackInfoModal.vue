<template>
  <QDialog
    class="TrackInfoModal"
    :modelValue="modelValue"
    @update:modelValue="(value) => $emit('update:modelValue', value)"
  >
    <QCard class="glass" flat>
      <QImg :src="track?.metadata?.artwork" />
      <QCardSection>
        <h2 class="text-h6 text-weight-bold">{{ track?.metadata?.title }}</h2>
        <p class="text-body1">{{ track?.metadata?.artist }}</p>
      </QCardSection>
    </QCard>
  </QDialog>
</template>

<script lang="ts" setup>
import { computed, toRefs } from 'vue'
import { QDialog, QCard, QCardSection, QImg, QItemLabel } from 'quasar'
import { useAudioStore } from '@/stores/audio'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})
defineEmits(['update:modelValue'])

const audio = useAudioStore()

const { modelValue } = toRefs(props)

const track = computed(() => audio.currentTrack)
</script>

<style lang="scss" scoped>
.TrackInfoModal {
  width: 412px;
  max-width: 90vw;
}
</style>
