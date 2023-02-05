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
            icon="audio_file"
            label="Add File"
            outline
            rounded
            style="color: var(--q-secondary)"
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
      <QItem class="q-pa-md glass-dark" style="opacity: 0.8">
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
          <canvas
            class="rounded-borders glass"
            ref="cWaveform"
            style="
              width: 100%;
              height: 100%;
              left: 0;
              opacity: 1;
              position: absolute;
              z-index: -1;
            "
          />
          <QItemLabel
            class="text-h3 cursor-pointer"
            lines="1"
            style="margin-top: -4px"
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
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
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
const cWaveform = ref<HTMLCanvasElement>()
const currentFrame = ref<number>()

const onTitleChange = (value: string | undefined) => {
  audio.setTitle(audio.currentTrack?.id as string, value as string)
}

const onArtistChange = (value: string | undefined) => {
  audio.setArtist(audio.currentTrack?.id as string, value as string)
}

onMounted(() => {
  const ctx = (cWaveform.value as HTMLCanvasElement).getContext('2d')

  const animate = () => {
    currentFrame.value = window.requestAnimationFrame(animate)

    const { width, height } = ctx!.canvas.getBoundingClientRect()
    const timeDomain = audio.controller?.analyser.timeDomain || []
    const bufferLength = timeDomain?.length || 0
    const sliceWidth = width / bufferLength
    const centerY = 0.5 * height

    ctx!.clearRect(0, 0, width, height)

    ctx!.lineWidth = 2
    ctx!.strokeStyle = 'rgba(38, 166, 154, 0.65)'
    ctx!.beginPath()

    timeDomain.forEach((v, i) => {
      const y = (v / 128) * centerY

      if (i === 0) {
        ctx!.moveTo(sliceWidth * i, y)
      } else {
        ctx!.lineTo(sliceWidth * i, y)
      }
    })

    ctx!.lineTo(width, centerY)
    ctx!.stroke()
  }

  animate()
})

onBeforeUnmount(() => {
  window.cancelAnimationFrame(currentFrame.value as number)
})
</script>

<style lang="scss" scoped>
.PlaylistDrawer {
  height: 100%;
}
</style>
