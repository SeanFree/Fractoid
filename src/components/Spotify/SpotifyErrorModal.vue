<template>
  <QDialog
    :modelValue="visible"
    @update:modelValue="(value) => modals.setVisibility(name, value)"
  >
  </QDialog>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount } from 'vue'
import { QDialog } from 'quasar'
import { useModalsStore } from '@/stores/modals'

const name = 'spotifyError'

const modals = useModalsStore()

const visible = computed(() => modals.getVisibility(name) || false)

onBeforeMount(() => {
  modals.add(name)
})
</script>
