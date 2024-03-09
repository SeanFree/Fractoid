<template>
  <QBtn
    :class="[
      'SpotifyAction q-pa-md',
      {
        'SpotifyAction--connected': spotify.isConnected,
      },
    ]"
    dense
    flat
    :icon="mdiSpotify"
    size="xl"
    :ripple="false"
    :to="spotify.isConnected ? '/spotify' : '/spotify/login'"
  />
</template>

<script lang="ts" setup>
import { QBtn } from 'quasar'
import { mdiSpotify } from '@quasar/extras/mdi-v6'
import { useSpotifyStore } from '@/stores/spotify'

const spotify = useSpotifyStore()
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
