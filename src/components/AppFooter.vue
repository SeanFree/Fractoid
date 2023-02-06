<template>
  <QFooter
    :modelValue="visible"
    @update:modelValue="$emit('update:modelValue', !visible)"
  >
    <QToolbar class="AppFooter__toolbar glass-dark flex shadow-2">
      <QSlider
        :aria-label="`Seek Time - Current: ${audio.currentTime}`"
        :loading="audio.loading"
        class="AppFooter__time q-mb-sm absolute"
        color="secondary"
        dark
        label
        :labelValue="hhmmss(audio.currentTime)"
        :min="0"
        :max="audio.currentTrack?.metadata?.duration || 0"
        :modelValue="audio.currentTime"
        @update:modelValue="onTimeSelect"
      />

      <div class="flex no-wrap">
        <QBtn
          class="q-mr-sm"
          :color="showPlaylist ? 'secondary' : 'teal-2'"
          flat
          round
          icon="queue_music"
          @click="$emit('update:showPlaylist', !showPlaylist)"
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
          @click="$emit('update:showShaderMenu', !showShaderMenu)"
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
          @click="modals.setVisibility('eq', !showEqModal)"
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
          @click="modals.setVisibility('appInfo', !showAppInfoModal)"
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

      <div class="flex no-wrap justify-center">
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

      <QBtn
        color="secondary"
        flat
        round
        :icon="volumeIcon"
        @click="toggleMute"
      />

      <QSlider
        class="AppFooter__volume q-mr-md"
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
    </QToolbar>
  </QFooter>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import { QBtn, QFooter, QToolbar, QTooltip, QSlider } from 'quasar'
import { VOLUME_TYPES } from '@/consts'
import { useAudioStore } from '@/stores/audio'
import { CEIL, hhmmss } from '@/utils'
import { useModalsStore } from '@/stores/modals'

const modals = useModalsStore()

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

const showEqModal = computed(() => modals.getVisibility('eq'))
const showAppInfoModal = computed(() => modals.getVisibility('appInfo'))

defineProps({
  showAppInfoModal: Boolean,
  showPlaylist: Boolean,
  showShaderMenu: Boolean,
  visible: {
    type: Boolean,
    default: true,
  },
})

defineEmits([
  'update:visible',
  'update:showPlaylist',
  'update:showShaderMenu',
  'update:showAppInfoModal',
])

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
    grid-template-columns: auto 1fr auto auto;
    grid-template-rows: 1fr;
    height: 60px;
  }

  &__time {
    left: 0;
    top: -14px;
    z-index: 1;
  }

  &__volume {
    width: 142px;
    position: relative;
  }
}
</style>
