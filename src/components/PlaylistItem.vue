<template>
  <QItem class="PlaylistItem q-pa-sm row" @click="handleClick">
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
      <QImg
        v-if="track.metadata?.artwork"
        class="PlaylistItem__img"
        alt="Album Unknown Cover Art"
        :src="track.metadata?.artwork"
      />

      <QBtn
        v-else
        class="PlaylistItem__missingCover rounded-borders"
        dense
        flat
      >
        <QIcon name="broken_image" size="28px" />
      </QBtn>
    </QItemSection>

    <QItemSection class="PlaylistItem__info">
      <QItemLabel
        :class="[
          'text-body1',
          'text-weight-bold',
          {
            'text-secondary': isCurrentTrack,
            'text-white': !isCurrentTrack,
          },
        ]"
      >
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

    <QItemSection class="PlaylistItem__info" side>
      <QBtn v-close-popup dense icon="info" rounded @click="onInfoClick">
      </QBtn>
    </QItemSection>
  </QItem>
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue'
import { QBtn, QIcon, QImg, QItem, QItemLabel, QItemSection } from 'quasar'
import type { AudioTrack } from '@/program'
import { useAudioStore } from '@/stores/audio'
import { useModalsStore } from '@/stores/modals'
import { hhmmss } from '@/utils'

const props = defineProps({
  track: {
    type: Object as PropType<AudioTrack>,
    required: true,
  },
})

const audio = useAudioStore()
const modals = useModalsStore()

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

const onInfoClick = () => {
  modals.show('trackInfo', { trackId: props.track.id })
}
</script>

<style lang="scss" scoped>
.PlaylistItem {
  border-bottom: 1px solid transparentize($secondary, 0.85);

  &__missingCover {
    height: 40px;
    width: 40px;
    flex-shrink: 0;
  }

  &__controls {
    min-width: 100px;
  }
}
</style>
