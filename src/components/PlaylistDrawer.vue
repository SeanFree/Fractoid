<template>
  <QDrawer
    class="PlaylistDrawer bg-transparent"
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
    </QList>
  </QDrawer>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { useAudioStore } from '@/stores/audio'
import { QBtn, QDrawer, QItem, QList, QScrollArea } from 'quasar'
import { PlaylistItem } from '@/components'
import { useModalsStore } from '@/stores/modals'
import { useDrawersStore } from '@/stores/drawers'

const audio = useAudioStore()
const modals = useModalsStore()
const drawers = useDrawersStore()

const drawerName = 'playlist'
const visible = computed(() => drawers.getVisibility(drawerName))

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
