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
      <QAvatar rounded>
        <QImg
          v-if="track.metadata?.artwork"
          class="PlaylistItem__img"
          alt="Album Unknown Cover Art"
          :src="track.metadata?.artwork"
        />

        <QBtn class="border-1" v-else style="height: 40px; width: 40px">
          <QIcon name="broken_image" size="28px" />
        </QBtn>
      </QAvatar>
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
      <QBtn icon="more_vert" dense flat rounded>
        <QMenu class="bg-transparent shadow-1" anchor="top right">
          <QList class="glass-dark" style="min-width: 100px">
            <QItem clickable v-close-popup @click="onEditClick">
              <QItemSection>
                <QItemLabel> Info </QItemLabel>
              </QItemSection>

              <QItemSection side>
                <QIcon name="info" size="16px" />
              </QItemSection>
            </QItem>

            <QSeparator />

            <QItem clickable v-close-popup>
              <QItemSection>
                <QItemLabel> Delete </QItemLabel>
              </QItemSection>

              <QItemSection side>
                <QIcon name="delete" size="16px" />
              </QItemSection>
            </QItem>
          </QList>
        </QMenu>
      </QBtn>
    </QItemSection>
  </QItem>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import type { AudioTrack } from '@/program'

import { computed } from 'vue'
import {
  QAvatar,
  QBtn,
  QIcon,
  QImg,
  QItem,
  QItemLabel,
  QItemSection,
  QList,
  QMenu,
  QSeparator,
} from 'quasar'
import { useAudioStore } from '@/stores/audio'
import { hhmmss } from '@/utils'
import { useModalsStore } from '@/stores/modals'

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

const onEditClick = () => {
  modals.show('trackInfo', { trackId: props.track.id })
}
</script>

<style lang="scss" scoped>
.PlaylistItem {
  border-bottom: 1px solid transparentize($secondary, 0.85);
}
</style>
