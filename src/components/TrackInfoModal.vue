<template>
  <QDialog
    class="TrackInfoModal"
    :modelValue="visible"
    @update:modelValue="onClose"
  >
    <QCard
      class="glass-dark shadow-2"
      style="width: 800px; height: 400px; max-width: 90vw"
    >
      <div class="flex justify-between no-wrap fit" style="width: 100%">
        <QCardSection class="q-px-lg fit" style="max-width: 800px">
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
            class="absolute"
            color="secondary"
            fab
            :icon="isCurrentTrack && audio.playing ? 'pause' : 'play_arrow'"
            style="bottom: 16px; left: 16px"
            @click="
              isCurrentTrack
                ? audio.togglePlayback()
                : audio.setCurrentTrack(track as AudioTrack)
            "
          />

          <QItemLabel
            class="text-h6 text-white absolute"
            lines="1"
            caption
            style="left: 84px; text-align: center; bottom: 36px"
          >
            {{ hhmmss(track?.metadata?.duration || 0) }}
          </QItemLabel>
        </QCardSection>

        <QImg
          class="absolute"
          :src="track?.metadata?.artwork"
          style="
            opacity: 0.65;
            -webkit-mask-image: -webkit-gradient(
              linear,
              right center,
              left center,
              from(rgba(0, 0, 0, 1)),
              to(rgba(0, 0, 0, 0))
            );
            height: 400px;
            right: 0;
            width: 600px;
          "
        />
      </div>
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
