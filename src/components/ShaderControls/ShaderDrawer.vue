<template>
  <QDrawer
    class="ShaderDrawer bg-transparent shadow-1"
    side="left"
    :width="600"
  >
    <QList class="ShaderDrawer glass-dark fit" dense>
      <QScrollArea class="fit">
        <SceneControls class="ShaderDrawer__item" />

        <ColorControls class="ShaderDrawer__item" />

        <FractalControls class="ShaderDrawer__item" />
      </QScrollArea>
    </QList>
  </QDrawer>
</template>

<script lang="ts" setup>
import { QDrawer, QScrollArea, QList } from 'quasar'
import SceneControls from './SceneControls.vue'
import ColorControls from './ColorControls.vue'
import FractalControls from './FractalControls.vue'
</script>

<style lang="scss" scoped>
.ShaderDrawer {
  width: 600px;

  &__item {
    border-bottom: 1px solid transparentize($secondary, 0.85);
  }
}
</style>
