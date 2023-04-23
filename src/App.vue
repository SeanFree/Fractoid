<template>
  <ShaderBackdrop />

  <section class="App">
    <audio ref="el" :id="audioId" />
    <QLayout view="hhh lpR fFf">
      <AppHeader />

      <PlaylistDrawer />
      <ShaderDrawer />

      <QPageContainer class="fit" @click="onPageClick" />

      <AppFooter />
    </QLayout>

    <EqualizerModal />
    <TrackInfoModal />
    <AddFileModal />
    <AppInfoModal
      :userAcknowledged="userAcknowledged"
      @hide="userAcknowledged = true"
    />
    <SpotifyLoginModal />
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { QBtn, QLayout, QPageContainer } from 'quasar'
import { mdiSpotify } from '@quasar/extras/mdi-v6'

import { TRACK_LIST_DEFAULT } from '@/consts'
import { getUniqueId } from '@/utils'
import { useAudioStore } from '@/stores/audio'
import { useDrawersStore } from '@/stores/drawers'

import {
  AddFileModal,
  AppInfoModal,
  AppFooter,
  AppHeader,
  EqualizerModal,
  PlaylistDrawer,
  ShaderBackdrop,
  ShaderDrawer,
  SpotifyAction,
  SpotifyLoginModal,
  TrackInfoModal,
} from '@/components'

const audioId = `audio-${getUniqueId()}`
const el = ref()
const audio = useAudioStore()
const drawers = useDrawersStore()

const userAcknowledged = ref(import.meta.env.DEV)

const onPageClick = () => drawers.hideAll()

onMounted(async () => {
  audio.create(el.value as HTMLAudioElement)
  audio.addAll(TRACK_LIST_DEFAULT)
})
</script>

<style lang="scss" scoped>
@import '@/styles/utils.scss';
.App {
  &__main {
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
  }

  :deep(.q-drawer),
  :deep(.q-footer) {
    background: transparent;
  }
}
</style>
