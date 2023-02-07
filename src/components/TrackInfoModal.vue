<template>
  <QDialog
    class="TrackInfoModal"
    :modelValue="visible"
    @update:modelValue="onClose"
  >
    <QCard class="TrackInfoModal__content glass-dark shadow-2 flex">
      <QCardSection class="q-px-lg fit fit">
        <QItemLabel class="text-h2" lines="1">
          {{ track?.metadata?.title }}
        </QItemLabel>

        <QItemLabel class="text-h5" lines="1">
          {{ track?.metadata?.artist }}
        </QItemLabel>

        <QItemLabel class="text-body1" lines="1">
          {{ track?.metadata?.album }}
        </QItemLabel>

        <QItemLabel class="text-body1" lines="1">
          {{ track?.metadata?.year }}
        </QItemLabel>

        <QBtn
          class="TrackInfoModal__play absolute"
          color="secondary"
          fab
          :icon="isCurrentTrack && audio.playing ? 'pause' : 'play_arrow'"
          @click="
            isCurrentTrack
              ? audio.togglePlayback()
              : audio.setCurrentTrack(track as AudioTrack)
          "
        />

        <QItemLabel
          class="TrackInfoModal__time text-h6 text-white absolute"
          lines="1"
          caption
        >
          {{ hhmmss(track?.metadata?.duration || 0) }}
        </QItemLabel>
      </QCardSection>

      <QImg
        class="TrackInfoModal__cover absolute"
        :src="track?.metadata?.artwork"
      />
    </QCard>
  </QDialog>
</template>

<script lang="ts" setup>
import type { AudioTrack } from '@/program'

import { computed, onBeforeMount } from 'vue'
import { QBtn, QCard, QCardSection, QDialog, QImg, QItemLabel } from 'quasar'
import { useAudioStore } from '@/stores/audio'
import { useModalsStore } from '@/stores/modals'
import { hhmmss } from '@/utils'

const name = 'trackInfo'

const audio = useAudioStore()
const modals = useModalsStore()

const visible = computed(() => modals.getVisibility(name))
const data = computed<{ trackId: string }>(
  () => modals.getData(name) as { trackId: string }
)
const track = computed(() =>
  data.value ? audio.controller?.getTrack(data.value.trackId) : null
)
const isCurrentTrack = computed(
  () => data.value.trackId === audio.currentTrack?.id
)

const onClose = () => {
  modals.hide(name, true)
}

onBeforeMount(() => {
  modals.add(name)
})
</script>

<style lang="scss" scoped>
.TrackInfoModal {
  &__content {
    height: 400px;
    max-width: 90vw;
    width: 800px;
  }

  &__play {
    bottom: 16px;
    left: 16px;
  }

  &__cover {
    -webkit-mask-image: -webkit-gradient(
      linear,
      right center,
      left center,
      from(rgba(0, 0, 0, 1)),
      to(rgba(0, 0, 0, 0))
    );
    height: 400px;
    opacity: 0.65;
    right: 0;
    width: 600px;
  }

  &__time {
    bottom: 36px;
    left: 84px;
    text-align: center;
  }
}
</style>
