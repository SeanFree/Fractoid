<template>
  <QFooter
    :modelValue="visible"
    @update:modelValue="$emit('update:modelValue', !visible)"
  >
    <QToolbar class="glass-dark flex" style="height: 60px">
      <QSlider
        :aria-label="`Seek Time - Current: ${audio.currentTime}`"
        :loading="audio.loading"
        class="q-mb-sm absolute"
        style="left: 0; top: -14px; z-index: 1"
        color="secondary"
        dark
        label
        :labelValue="hhmmss(audio.currentTime)"
        :min="0"
        :max="audio.currentTrack?.metadata?.duration || 0"
        :modelValue="audio.currentTime"
        @update:modelValue="onTimeSelect"
      />
      <QBtn
        class="q-mr-md"
        :color="showPlaylist ? 'secondary' : 'teal-2'"
        flat
        round
        icon="queue_music"
        @click="$emit('update:showPlaylist', !showPlaylist)"
      />
      <QBtn
        class="q-mr-md"
        :color="showShaderMenu ? 'secondary' : 'teal-2'"
        flat
        round
        icon="tune"
        @click="$emit('update:showShaderMenu', !showShaderMenu)"
      />
      <QBtn
        class="q-mr-md"
        :color="showEqModal ? 'secondary' : 'teal-2'"
        flat
        round
        icon="equalizer"
        @click="$emit('update:showEqModal', !showEqModal)"
      />
      <div class="flex no-wrap q-mx-auto">
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
        color="secondary"
        dense
        flat
        :max="1"
        :min="0"
        round
        :step="0.1"
        label
        :labelValue="(audio.volume * 10).toFixed(0)"
        style="max-width: 142px; position: relative; z-index: 4"
        :modelValue="audio.volume"
        @update:modelValue="setVolume"
      />
    </QToolbar>
  </QFooter>
</template>

<script lang="ts" setup>
import { VOLUME_TYPES } from '@/consts'
import { computed, ref, onMounted } from 'vue'
import { QBtn, QFooter, QToolbar, QSlider } from 'quasar'
import { useAudioStore } from '@/stores/audio'
import { CEIL, hhmmss } from '@/utils'

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

defineProps({
  showPlaylist: Boolean,
  showShaderMenu: Boolean,
  showEqModal: Boolean,
  visible: {
    type: Boolean,
    default: true,
  },
})

defineEmits([
  'update:showPlaylist',
  'update:showShaderMenu',
  'update:showInfoModal',
  'update:showEqModal',
  'update:modelValue',
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
