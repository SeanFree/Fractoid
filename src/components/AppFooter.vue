<template>
  <QFooter>
    <QToolbar class="AppFooter__toolbar glass-dark shadow-2">
      <div class="flex no-wrap">
        <QBtn
          class="q-mr-sm"
          :color="showPlaylist ? 'secondary' : 'teal-2'"
          flat
          round
          icon="queue_music"
          @click="drawers.toggleVisibility('playlist')"
        >
          <QTooltip
            class="glass-secondary shadow-1"
            transitionShow="jump-up"
            transitionHide="jump-down"
          >
            Playlist
          </QTooltip>
        </QBtn>

        <QBtn
          class="q-mr-sm"
          :color="showShaderMenu ? 'secondary' : 'teal-2'"
          flat
          round
          icon="tune"
          @click="drawers.toggleVisibility('shaders')"
        >
          <QTooltip
            class="glass-secondary shadow-1"
            transitionShow="jump-up"
            transitionHide="jump-down"
          >
            Shader Menu
          </QTooltip>
        </QBtn>

        <QBtn
          class="q-mr-sm"
          :color="showEqModal ? 'secondary' : 'teal-2'"
          flat
          round
          icon="equalizer"
          @click="modals.toggleVisibility('eq')"
        >
          <QTooltip
            class="glass-secondary shadow-1"
            transitionShow="jump-up"
            transitionHide="jump-down"
          >
            Equalizer
          </QTooltip>
        </QBtn>

        <QBtn
          class="q-mr-sm"
          :color="showAppInfoModal ? 'secondary' : 'teal-2'"
          flat
          round
          icon="info"
          @click="modals.toggleVisibility('appInfo')"
        >
          <QTooltip
            class="glass-secondary shadow-1"
            transitionShow="jump-up"
            transitionHide="jump-down"
          >
            Info
          </QTooltip>
        </QBtn>
      </div>

      <div class="AppFooter__audioControls flex column q-mx-xl">
        <div class="flex no-wrap justify-center q-pt-md q-mb-sm">
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
            {{ hhmmss(0) }}
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
          <QItemSection side>{{
            hhmmss(audio.currentTrack?.metadata?.duration || 0)
          }}</QItemSection>
        </QItem>
      </div>

      <div class="AppFooter__volume flex justify-end no-wrap">
        <QBtn
          class="AppFooter__volumeToggle"
          color="secondary"
          flat
          round
          :icon="volumeIcon"
          @click="toggleMute"
        />

        <QSlider
          class="AppFooter__volumeSlider q-mr-md"
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
      </div>
    </QToolbar>
  </QFooter>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import {
  QBtn,
  QFooter,
  QItem,
  QItemSection,
  QToolbar,
  QTooltip,
  QSlider,
} from 'quasar'
import { VOLUME_TYPES } from '@/consts'
import { useAudioStore } from '@/stores/audio'
import { CEIL, hhmmss } from '@/utils'
import { useModalsStore } from '@/stores/modals'
import { useDrawersStore } from '@/stores/drawers'

const modals = useModalsStore()
const drawers = useDrawersStore()

const previousVolume = ref(0)

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

const showPlaylist = computed(() => drawers.getVisibility('playlist'))
const showShaderMenu = computed(() => drawers.getVisibility('shaders'))
const showEqModal = computed(() => modals.getVisibility('eq'))
const showAppInfoModal = computed(() => modals.getVisibility('appInfo'))

const audio = useAudioStore()

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
    width: 100%;
  }

  &__volume {
    align-items: center;
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
