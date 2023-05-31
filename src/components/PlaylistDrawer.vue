<template>
  <QDrawer
    class="PlaylistDrawer bg-transparent shadow-1"
    side="left"
    :width="600"
    :modelValue="visible"
    @update:modelValue="(value) => drawers.setVisibility(drawerName, value)"
  >
    <QList class="PlaylistDrawer__content glass-dark fit">
      <QItem class="flex justify-end q-py-md">
        <QBtn
          autofocus
          icon="audio_file"
          color="secondary"
          label="Add File"
          outline
          rounded
          @click="modals.show('addFile')"
        ></QBtn>
      </QItem>

      <QScrollArea class="PlaylistDrawer__items">
        <PlaylistItem
          v-for="track in audio.tracks"
          :key="track.id"
          :track="track"
        >
          {{ track.id }}
        </PlaylistItem>
      </QScrollArea>

      <QItem class="PlaylistDrawer__trackDisplay q-pa-md glass-dark">
        <QImg
          v-if="!!artworkSrc"
          class="PlaylistDrawer__cover rounded-borders q-mr-lg"
          alt="Album Unknown Cover Art"
          height="128px"
          width="128px"
          :src="artworkSrc"
        />

        <QBtn
          v-else
          class="PlaylistDrawer__missingCover rounded-borders q-mr-lg"
        >
          <QIcon name="broken_image" size="104px" />
        </QBtn>

        <QItemSection>
          <WaveformVisualizer
            class="PlaylistDrawer__waveform"
            :animate="visible"
          />

          <QItemLabel
            class="PlaylistDrawer__artist text-h3 cursor-pointer"
            lines="1"
          >
            {{ title }}
            <QPopupEdit
              v-slot="scope"
              class="glass-info text-white"
              :modelValue="title"
              @save="onTitleChange"
            >
              <QInput
                dark
                color="white"
                v-model="scope.value"
                dense
                autofocus
                counter
                @keyup.enter="scope.set"
              >
                <template #append>
                  <QIcon name="edit" />
                </template>
              </QInput>
            </QPopupEdit>
          </QItemLabel>

          <QItemLabel class="text-h6 cursor-pointer q-mt-lg" lines="1">
            {{ artist }}
            <QPopupEdit
              v-slot="scope"
              class="glass-info text-white"
              :modelValue="artist"
              @save="onArtistChange"
            >
              <QInput
                dark
                color="white"
                v-model="scope.value"
                dense
                autofocus
                counter
                @keyup.enter="scope.set"
              >
                <template #append>
                  <QIcon name="edit" />
                </template>
              </QInput>
            </QPopupEdit>
          </QItemLabel>
        </QItemSection>
      </QItem>
    </QList>
  </QDrawer>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { useAudioStore } from '@/stores/audio'
import {
  QBtn,
  QDrawer,
  QIcon,
  QImg,
  QInput,
  QItem,
  QItemLabel,
  QItemSection,
  QList,
  QPopupEdit,
  QScrollArea,
} from 'quasar'
import PlaylistItem from './PlaylistItem.vue'
import WaveformVisualizer from './WaveformVisualizer.vue'
import { useModalsStore } from '@/stores/modals'
import { useDrawersStore } from '@/stores/drawers'

const audio = useAudioStore()
const modals = useModalsStore()
const drawers = useDrawersStore()

const drawerName = 'playlist'

const visible = computed(() => drawers.getVisibility(drawerName))

const title = computed(
  () => audio.currentTrack?.metadata?.title || 'Title Unknown'
)
const artist = computed(
  () => audio.currentTrack?.metadata?.artist || 'Artist Unknown'
)
const artworkSrc = computed(
  () => audio.currentTrack?.metadata?.artwork || undefined
)

const onTitleChange = (value: string | undefined) => {
  audio.setTitle(audio.currentTrack?.id as string, value as string)
}

const onArtistChange = (value: string | undefined) => {
  audio.setArtist(audio.currentTrack?.id as string, value as string)
}

onMounted(() => {
  drawers.add(drawerName)
})
</script>

<style lang="scss" scoped>
.PlaylistDrawer {
  max-width: 600px;

  &__content {
    display: flex;
    flex-direction: column;
  }

  &__items {
    flex: 1;
  }

  &__trackDisplay {
    opacity: 0.8;
  }

  &__cover {
    flex-shrink: 0;
  }

  &__missingCover {
    height: 128px;
    width: 128px;
  }

  &__artist {
    margin-top: -16px;
    margin-bottom: 12px;
  }

  &__waveform {
    width: 100%;
    height: 100%;
    left: 0;
    opacity: 1;
    position: absolute;
    z-index: -1;
  }
}
</style>
