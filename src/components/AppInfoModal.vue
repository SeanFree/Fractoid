<template>
  <Dialog
    v-model:visible="visible"
    class="fx-glass !fx-glass fx-glass--dark !fx-border-1 !fx-border-teal-400/20 !fx-shadow-lg !fx-shadow-teal-200/25 fx-max-w-xl"
    :closable="userAcknowledged"
    :closeOnEscape="userAcknowledged"
    :dismissableMask="userAcknowledged"
    modal
  >
    <template #header>
      <div
        class="fx-flex fx-items-center fx-flex-nowrap fx-text-teal-400 fx-gap-4"
      >
        <Image src="/Fractoid-logo.svg" width="64" height="64" />
        <p class="fx-text-6xl">Fractoid</p>
      </div>
    </template>

    <div class="fx-flex fx-flex-col fx-gap-4 fx-mb-4">
      <p>
        An audio visualizer app that uses audio frequency data to animate a
        julia set fractal.
      </p>

      <div>
        <p>Built with</p>

        <ul class="fx-list-disc fx-list-inside">
          <li>Vue</li>
          <li>TypeScript</li>
          <li>PrimeVue</li>
          <li>WebGL</li>
          <li>GLSL</li>
          <li>Web Audio API</li>
        </ul>
      </div>

      <p>
        Pre-loaded songs were selected from
        <Button
          as="a"
          href="https://studio.youtube.com/"
          rel="noopener noreferrer"
          flat
          icon="pi pi-external-link"
          iconPos="right"
          inline
          label="YouTube Audio Library"
          outlined
          rounded
          target="_blank"
        />
      </p>
    </div>

    <Message severity="info" icon="pi pi-exclamation-triangle">
      This application may potentially trigger seizures for people with
      photosensitive epilepsy. User discretion is advised
    </Message>

    <template #footer>
      <Button
        as="a"
        href="https://github.com/SeanFree/Fractoid"
        icon="pi pi-github"
        label="View on GitHub"
        inline
        outlined
        rounded
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Fractoid on GitHub (Opens in a new tab)"
      />
      <Button
        icon="pi pi-chevron-right"
        iconPos="right"
        :label="userAcknowledged ? 'Close' : 'Start'"
        size="large"
        rounded
        @click="handleClose"
      />
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount } from 'vue'

import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Image from 'primevue/image'
import Message from 'primevue/message'

import { useModalsStore } from '@/stores/modals'

const name = 'appInfo'

defineProps<{ userAcknowledged: boolean }>()
const emit = defineEmits(['close'])

const modals = useModalsStore()

const visible = computed<boolean>({
  get() {
    return modals.getVisibility(name)
  },
  set(value) {
    modals.setVisibility(name, value)
  },
})

const handleClose = () => {
  emit('close')
  visible.value = false
}

onBeforeMount(() => {
  modals.add(name, true)
})
</script>
