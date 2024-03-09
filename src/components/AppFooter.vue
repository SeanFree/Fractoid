<template>
  <QFooter>
    <QToolbar class="AppFooter__toolbar glass-dark">
      <QItem class="AppFooter__trackDisplay q-pa-md">
        <QImg
          class="AppFooter__cover q-mr-lg"
          alt="Album Unknown Cover Art"
          height="68px"
          width="68px"
          :src="artworkSrc"
        >
          <template #error>
            <div class="AppFooter__missingCover q-mr-lg">
              <QIcon name="broken_image" size="64px" />
            </div>
          </template>
        </QImg>

        <QItemSection>
          <QItemLabel class="AppFooter__artist text-h6" lines="1">
            {{ title }}
          </QItemLabel>

          <QItemLabel class="text-caption" lines="1">
            {{ artist }}
          </QItemLabel>
        </QItemSection>
      </QItem>

      <QItem class="AppFooter__audioControls flex column q-mx-xl">
        <div class="flex row no-wrap justify-center q-pt-md">
          <QBtn
            class="q-mr-md"
            :color="audio.isShuffled ? 'secondary' : 'teal-2'"
            flat
            round
            icon="shuffle"
            @click="audio.toggleShuffle"
          />

          <QBtn
            class="q-mr-md"
            color="secondary"
            flat
            round
            icon="skip_previous"
            @click="audio.skipPrevious"
          />

          <QBtn
            class="q-mr-md"
            color="secondary"
            flat
            round
            :icon="audio.playing ? 'pause' : 'play_arrow'"
            @click="audio.togglePlayback"
          />

          <QBtn
            class="q-mr-md"
            color="secondary"
            flat
            round
            icon="skip_next"
            @click="audio.skipNext"
          />

          <QBtn
            class="q-mr-sm"
            :color="audio.controller?.repeat === 'off' ? 'teal-2' : 'secondary'"
            flat
            round
            :icon="audio.controller?.repeat === 'one' ? 'repeat_one' : 'repeat'"
            @click="audio.toggleRepeat"
          />
        </div>

        <QItem class="AppFooter__time">
          <QItemSection side>
            <QItemLabel class="text-body2">
              {{ hhmmss(0) }}
            </QItemLabel>
          </QItemSection>

          <QItemSection>
            <QSlider
              :aria-label="`Seek Time - Current: ${audio.currentTime}`"
              :loading="audio.loading"
              color="secondary"
              dark
              label
              :labelValue="hhmmss(audio.currentTime)"
              :min="0"
              :max="audio.currentTrack?.metadata?.duration || 0"
              :modelValue="audio.currentTime"
              @update:modelValue="onTimeSelect"
            />
          </QItemSection>

          <QItemSection side>
            <QItemLabel class="text-body2">
              {{ hhmmss(audio.currentTrack?.metadata?.duration || 0) }}
            </QItemLabel>
          </QItemSection>
        </QItem>
      </QItem>

      <QItem
        class="AppFooter__volume flex items-center justify-end no-wrap q-mr-sm"
      >
        <QItemSection avatar>
          <QBtn
            class="AppFooter__volumeToggle"
            color="secondary"
            flat
            round
            :icon="volumeIcon"
            @click="toggleMute"
          />
        </QItemSection>

        <QSlider
          class="AppFooter__volumeSlider"
          color="secondary"
          dense
          flat
          :max="1"
          :min="0"
          round
          :step="0.05"
          label
          :labelValue="(audio.volume * 10).toFixed(1)"
          :modelValue="audio.volume"
          @update:modelValue="setVolume"
        />
      </QItem>
    </QToolbar>
  </QFooter>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import {
  QBtn,
  QFooter,
  QIcon,
  QImg,
  QItem,
  QItemLabel,
  QItemSection,
  QToolbar,
  QSlider,
} from 'quasar'

import { useAudioStore } from '@/stores/audio'

import { VOLUME_TYPES } from '@/consts'
import { CEIL, hhmmss } from '@/utils'

const audio = useAudioStore()

const previousVolume = ref(0)

const title = computed(
  () => audio.currentTrack?.metadata?.title || 'Title Unknown'
)
const artist = computed(
  () => audio.currentTrack?.metadata?.artist || 'Artist Unknown'
)
const artworkSrc = computed(
  () => audio.currentTrack?.metadata?.artwork || undefined
)

const toggleMute = () => {
  if (audio.volume === 0) {
    audio.setVolume(previousVolume.value)
    previousVolume.value = 0
  } else {
    previousVolume.value = audio.volume
    audio.setVolume(0)
  }
}

const setVolume = (value: number | null) => {
  previousVolume.value = 0

  audio.setVolume(value as number)
}

const onTimeSelect = (value: number | null) =>
  audio.setCurrentTime(value as number | undefined)

const volumeIcon = computed(
  () => VOLUME_TYPES[CEIL(audio.volume * (VOLUME_TYPES.length - 1)) | 0]
)

onMounted(() => {
  navigator.mediaSession.setActionHandler('play', () => {
    audio.play()
  })
  navigator.mediaSession.setActionHandler('pause', () => {
    audio.pause()
  })
  navigator.mediaSession.setActionHandler('nexttrack', () => {
    audio.skipNext()
  })
  navigator.mediaSession.setActionHandler('previoustrack', () => {
    audio.skipPrevious()
  })
})
</script>

<style lang="scss" scoped>
.AppFooter {
  &__toolbar {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    grid-template-rows: 1fr;
    padding: 0;
    width: 100%;
  }

  &__cover {
    flex-shrink: 0;
  }

  &__missingCover {
    border: 1px solid white;
    height: 98px;
    width: 98px;
  }

  &__volumeSlider,
  &__volumeToggle {
    justify-self: flex-end;
  }

  &__volumeSlider {
    width: 128px;
  }
}
</style>
