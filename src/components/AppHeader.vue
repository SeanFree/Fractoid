<template>
  <QHeader class="AppHeader glass-dark">
    <QToolbar class="AppHeader__toolbar fit">
      <QImg
        class="AppHeader__icon q-mr-lg"
        src="/Fractoid-icon.svg"
        height="32px"
        width="32px"
      />

      <div class="flex fit row align-center justify-start">
        <QBtn
          class="AppHeader__button q-mr-sm glass-dark"
          color="white"
          dense
          flat
          rounded
          @click.stop="() => drawers.toggleVisibility('playlist')"
        >
          <QIcon
            class="q-mr-xs"
            :color="drawers.getVisibility('playlist') ? 'teal' : 'white'"
            name="queue_music"
          />
          Playlist
        </QBtn>

        <QBtn
          class="AppHeader__button q-mr-sm glass-dark"
          color="white"
          dense
          flat
          rounded
          @click.stop="() => drawers.toggleVisibility('shaders')"
        >
          <QIcon
            class="q-mr-xs"
            :color="drawers.getVisibility('shaders') ? 'teal' : 'white'"
            name="tune"
            size="20px"
          />
          Shader Controls
        </QBtn>

        <QBtn
          class="AppHeader__button q-mr-sm glass-dark"
          color="white"
          dense
          flat
          rounded
          @click.stop="() => modals.toggleVisibility('eq')"
        >
          <QIcon
            class="q-mr-xs"
            :color="modals.getVisibility('eq') ? 'teal' : 'white'"
            name="equalizer"
            size="20px"
          />
          Equalizer
        </QBtn>

        <QBtn
          class="AppHeader__button q-mr-sm glass-dark"
          color="white"
          dense
          flat
          rounded
          @click.stop="() => modals.toggleVisibility('appInfo')"
        >
          <QIcon
            class="q-mr-xs"
            :color="modals.getVisibility('appInfo') ? 'teal' : 'white'"
            name="info"
            size="22px"
          />
          Info
        </QBtn>
      </div>

      <SpotifyAction />
    </QToolbar>
  </QHeader>
</template>

<script lang="ts" setup>
import { QBtn, QHeader, QIcon, QImg, QToolbar } from 'quasar'
import { SpotifyAction } from '@/components'
import { useDrawersStore } from '@/stores/drawers'
import { useModalsStore } from '@/stores/modals'

const drawers = useDrawersStore()
const modals = useModalsStore()
</script>

<style lang="scss" scoped>
.AppHeader {
  &__title {
    flex-grow: unset;
    flex-shrink: unset;
    width: 32px;
    height: 32px;
  }

  &__toolbar {
    padding: 0 0 0 16px !important;
  }

  &__icon {
    border-radius: 0 !important;
  }

  &__button {
    padding: 0 12px 0 4px !important;
  }
}
</style>
