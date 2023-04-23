<template>
  <QBtn
    :class="[
      'SpotifyAction q-pa-md',
      {
        'SpotifyAction--connected': isConnected,
      },
    ]"
    dense
    flat
    :icon="mdiSpotify"
    size="xl"
    :ripple="false"
    @click="onClick"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { QBtn } from 'quasar'
import { mdiSpotify } from '@quasar/extras/mdi-v6'
import { useModalsStore } from '@/stores/modals'
import { useSpotifyStore } from '@/stores/spotify'
import { useDrawersStore } from '@/stores/drawers'

const drawers = useDrawersStore()
const modals = useModalsStore()
const spotify = useSpotifyStore()

const isConnected = computed(() => spotify.isConnected)

const onClick = () => {
  drawers.hideAll()
  modals.show('spotifyLogin')
}
</script>

<style lang="scss">
.SpotifyAction {
  background-color: $spotify-black !important;
  border-radius: 0 !important;
  color: white !important;

  &--connected {
    color: $spotify-green !important;
  }
}
</style>
