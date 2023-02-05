<template>
  <QDrawer
    class="bg-transparent shadow-1"
    side="left"
    :width="600"
    style="max-width: 600px"
  >
    <QList
      class="PlaylistDrawer glass-dark fit"
      style="display: flex; flex-direction: column"
    >
      <QScrollArea style="flex: 1">
        <QItem class="flex justify-end q-py-sm">
          <QBtn
            autofocus
            rounded
            icon="audio_file"
            color="secondary"
            label="Add File"
            @click="modals.show('addFile')"
          ></QBtn>
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
        <QImg
          v-if="!!artworkSrc"
          class="MediaPlayer__img rounded-borders q-mr-lg"
          alt="Album Unknown Cover Art"
          height="128px"
          width="128px"
          :src="artworkSrc"
          style="flex-shrink: 0"
        />

        <QBtn
          v-else
          class="rounded-borders q-mr-lg"
          style="height: 128px; width: 128px"
        >
          <QIcon name="broken_image" size="104px" />
        </QBtn>
        <QItemSection>
          <QItemLabel class="text-h3 cursor-pointer" lines="1">
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
          <QItemLabel class="text-h6 cursor-pointer" lines="1">
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
import { computed } from 'vue'
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
import { useModalsStore } from '@/stores/modals'

const audio = useAudioStore()
const modals = useModalsStore()

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
</script>

<style lang="scss" scoped>
.PlaylistDrawer {
  height: 100%;
}
</style>
