<template>
  <menu class="AppNavigation">
    <span
      class="q-btn-group row no-wrap q-btn-group--rounded inline"
      role="group"
    >
      <QBtn class="AppNavigation__btn glass" round>
        <QIcon name="music_note" color="blue-6" />
      </QBtn>
      <QBtn class="AppNavigation__btn glass" round>
        <QIcon name="queue_music" color="blue-6" />
      </QBtn>
      <QBtn class="AppNavigation__btn glass" round>
        <QIcon name="graphic_eq" color="blue-6" />
      </QBtn>
      <QBtn class="AppNavigation__btn glass" round>
        <QIcon name="tune" color="blue-6" />
      </QBtn>
      <QBtn class="AppNavigation__btn glass" round>
        <QIcon name="info" color="blue-6" />
      </QBtn>
    </span>
  </menu>
</template>

<script lang="ts" setup>
import type { DrawerName } from '@/stores/drawers'

import { onMounted, onBeforeUnmount } from 'vue'
import { QBtn, QIcon } from 'quasar'
import { useDrawersStore } from '@/stores/drawers'

const drawers = useDrawersStore()

type ToggleKey = 'E' | 'I' | 'M' | 'P' | 'S'
type ToggleKeyMap = {
  [key in ToggleKey]: DrawerName
}

const toggleKeyMap: ToggleKeyMap = {
  E: 'equalizer',
  I: 'info',
  M: 'media',
  P: 'playlist',
  S: 'shaders',
}

const handleControlKeys = ({ key, shiftKey }: KeyboardEvent) => {
  if (shiftKey && key in toggleKeyMap) {
    drawers.toggleVisibility(toggleKeyMap[key as ToggleKey])
  }
}

// onMounted(() => {
//   window.addEventListener('keydown', handleControlKeys)
// })

// onBeforeUnmount(() => {
//   window.removeEventListener('keydown', handleControlKeys)
// })
</script>

<style lang="scss" scoped>
.AppNavigation {
  display: inline-block;
  position: relative;
  z-index: 3;
}
</style>
