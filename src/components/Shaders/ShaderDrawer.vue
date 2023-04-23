<template>
  <QDrawer
    class="ShaderDrawer bg-transparent"
    side="left"
    :width="600"
    :modelValue="visible"
    @update:modelValue="(value) => drawers.setVisibility(drawerName, value)"
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
import { computed, onMounted } from 'vue'
import { useDrawersStore } from '@/stores/drawers'
import SceneControls from './SceneControls.vue'
import ColorControls from './ColorControls.vue'
import FractalControls from './FractalControls.vue'

const drawers = useDrawersStore()

const drawerName = 'shaders'

const visible = computed(() => drawers.getVisibility(drawerName))

onMounted(() => {
  drawers.add(drawerName)
})
</script>

<style lang="scss" scoped>
.ShaderDrawer {
  width: 600px;

  &__item {
    border-bottom: 1px solid transparentize($secondary, 0.85);
  }
}
</style>
