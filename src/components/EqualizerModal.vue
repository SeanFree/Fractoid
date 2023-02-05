<template>
  <QDialog
    :modelValue="visible"
    @update:modelValue="(value) => modals.setVisibility(name, value)"
  >
    <GraphicEqualizer />
  </QDialog>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount } from 'vue'
import { QDialog } from 'quasar'
import GraphicEqualizer from './GraphicEqualizer.vue'
import { useModalsStore } from '@/stores/modals'

const name = 'eq'

const modals = useModalsStore()

const visible = computed(() => modals.getVisibility(name) || false)

onBeforeMount(() => {
  modals.add(name)
})
</script>
