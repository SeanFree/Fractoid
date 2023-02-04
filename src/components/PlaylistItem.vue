<template>
  <QItem class="PlaylistItem q-pa-sm q-pr-lg row" @click="handleClick">
    <QItemSection side>
      <QBtn
        size="14px"
        :color="isCurrentTrack ? 'secondary' : 'white'"
        flat
        dense
        round
        :icon="isPlaying ? 'pause' : 'play_arrow'"
        @click="togglePlayback"
      />
    </QItemSection>
    <QItemSection avatar>
      <QAvatar rounded>
        <QImg
          class="PlaylistItem__img"
          alt="Album Unknown Cover Art"
          :src="track.metadata?.artwork || ''"
        />
      </QAvatar>
    </QItemSection>

    <QItemSection class="PlaylistItem__info">
      <QItemLabel class="text-body1 text-weight-bold">
        {{ track.metadata?.title || 'Title Unknown' }}
      </QItemLabel>

      <QItemLabel class="text-body2" caption>
        {{ track.metadata?.artist || 'Artist Unknown' }}
      </QItemLabel>
    </QItemSection>

    <QItemSection class="PlaylistItem__info" side>
      <QItemLabel caption class="text-body1 text-weight-bold">
        {{ hhmmss(track.metadata?.duration as number) || 'N/A' }}
      </QItemLabel>
    </QItemSection>
  </QItem>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import type { AudioTrack } from '@/program'

import { computed } from 'vue'
import { QBtn, QImg, QItem, QItemLabel, QItemSection, QAvatar } from 'quasar'
import { useAudioStore } from '@/stores/audio'
import { hhmmss } from '@/utils'

const props = defineProps({
  track: {
    type: Object as PropType<AudioTrack>,
    required: true,
  },
})

const audio = useAudioStore()
const isCurrentTrack = computed(() => audio.currentTrack?.id === props.track.id)
const isPlaying = computed(() => isCurrentTrack.value && audio.playing)

const togglePlayback = () => {
  if (isCurrentTrack.value) {
    audio.togglePlayback()
  } else {
    audio.setCurrentTrack(props.track)
  }
}

const handleClick = () => {
  audio.setCurrentTrack(props.track)
}
</script>

<style lang="scss" scoped>
.PlaylistItem {
  border-bottom: 1px solid transparentize($secondary, 0.85);
}
</style>
