<template>
  <section class="App">
    <audio ref="el" :id="audioId" />
    <QLayout view="hhh lpR fFf">
      <QPageContainer class="fit" @click="onPageClick">
        <main class="App__main fit">
          <ShaderBackdrop />
        </main>
      </QPageContainer>

      <PlaylistDrawer v-model="showPlaylist" />
      <ShaderDrawer v-model="showShaderMenu" />

      <AppFooter
        v-model:showPlaylist="showPlaylist"
        v-model:showShaderMenu="showShaderMenu"
        v-model:showEqModal="showEqModal"
        v-model:visible="showAppFooter"
        @update:visible="(value: boolean) => showAppFooter = value"
      />
      <EqualizerModal v-model="showEqModal" />
      <TrackInfoModal v-model="showTrackInfoModal" />
    </QLayout>
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { QLayout, QPageContainer } from 'quasar'

import ShaderBackdrop from '@/components/ShaderBackdrop.vue'
import PlaylistDrawer from '@/components/PlaylistDrawer.vue'
import ShaderDrawer from '@/components/ShaderControls/ShaderDrawer.vue'
import EqualizerModal from './components/EqualizerModal.vue'
import TrackInfoModal from './components/TrackInfoModal.vue'

import { TRACK_LIST_DEFAULT } from '@/consts'
import { useAudioStore } from '@/stores/audio'
import { getUniqueId } from '@/utils'
import AppFooter from './components/AppFooter.vue'

const audioId = `audio-${getUniqueId()}`
const el = ref()
const audio = useAudioStore()

const showPlaylist = ref(false)
const showShaderMenu = ref(false)
const showEqModal = ref(false)
const showAppFooter = ref(true)
const showTrackInfoModal = ref(false)

const onPageClick = () => {
  showPlaylist.value = false
  showShaderMenu.value = false
}

watch(showShaderMenu, (value) => {
  if (value) {
    showPlaylist.value = false
  }
})

watch(showPlaylist, (value) => {
  if (value) {
    showShaderMenu.value = false
  }
})

onMounted(() => {
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

  :deep .q-drawer,
  :deep .q-footer {
    background: transparent;
  }
}
</style>
