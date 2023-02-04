<template>
  <QDrawer
    class="bg-transparent"
    side="left"
    :width="600"
    style="max-width: 600px"
  >
    <QList
      class="PlaylistDrawer glass-dark fit"
      style="display: flex; flex-direction: column"
    >
      <QScrollArea style="flex: 1">
        <QItem>
          <QItemSection class="q-py-sm" side>
            <QBtn
              autofocus
              rounded
              icon="audio_file"
              color="secondary"
              label="Add File"
            ></QBtn>
          </QItemSection>
        </QItem>
        <PlaylistItem
          v-for="track in audio.tracks"
          :key="track.id"
          :track="track"
        >
          {{ track.id }}
        </PlaylistItem>
      </QScrollArea>
      <QItem class="q-pa-md glass-secondary" style="opacity: 0.8">
        <QItemSection>
          <div class="flex no-wrap">
            <QImg
              class="MediaPlayer__img rounded-borders q-mr-lg"
              alt="Album Unknown Cover Art"
              height="128px"
              width="128px"
              :src="artworkSrc"
            />
            <div class="flex column justify-center" style="flex: 1">
              <QItemLabel class="text-h3">{{ title }}</QItemLabel>
              <QItemLabel class="text-h5">
                {{ artist }}
              </QItemLabel>
            </div>
          </div>
        </QItemSection>
      </QItem>
    </QList>
  </QDrawer>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useAudioStore } from '@/stores/audio'
import {
  QDrawer,
  QItem,
  QItemSection,
  QList,
  QBtn,
  QScrollArea,
  QImg,
  QItemLabel,
  QSlider,
} from 'quasar'
import PlaylistItem from './PlaylistItem.vue'

const audio = useAudioStore()

const title = computed(
  () => audio.currentTrack?.metadata?.title || 'Title Unknown'
)
const artist = computed(
  () => audio.currentTrack?.metadata?.artist || 'Artist Unknown'
)
const artworkSrc = computed(() => audio.currentTrack?.metadata?.artwork || '')
const onTimeSelect = (value: number | null) =>
  audio.setCurrentTime(value as number | undefined)
</script>

<style lang="scss" scoped>
.PlaylistDrawer {
  height: 100%;
}
</style>
