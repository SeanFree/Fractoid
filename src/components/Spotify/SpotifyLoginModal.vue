<template>
  <QDialog
    class="SpotifyLoginModal"
    :modelValue="visible"
    @update:modelValue="(value) => modals.setVisibility(name, value)"
  >
    <QCard class="SpotifyLoginModal__body" flat>
      <QCardSection
        class="SpotifyLoginModal__banner flex items-center no-wrap text-teal-4 q-mb-md"
      >
        <FractoidLogo class="SpotifyLoginModal__fractoidLogo" />

        <QIcon class="q-mx-lg" size="xl">
          <svg viewBox="0 0 24 24">
            <path :d="mdiConnection" />
          </svg>
        </QIcon>

        <QImg
          class="SpotifyLoginModal__logo"
          fit="contain"
          height="90px"
          src="/spotify-logo.svg"
          width="300px"
        />
      </QCardSection>

      <QCardSection class="SpotifyLoginModal__content q-mb-md">
        <h2 class="text-h4 text-center q-mb-xl">Connect with Spotify</h2>

        <p class="text-body1 q-mb-lg">
          Fractoid can connect with your account via the
          <QBtn
            href="https://developer.spotify.com/documentation/web-api"
            class="SpotifyLoginModal__docs glass-dark"
            :icon="mdiSpotify"
            iconRight="launch"
            label="Spotify Web API"
            outline
            rounded
            target="_blank"
            rel="noopener noreferrer"
            aria-label="(Opens in a new tab)"
          />
        </p>

        <p class="text-body1 q-mb-lg">
          Fractoid authenticates with Spotify using the
          <QBtn
            href="https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow"
            class="SpotifyLoginModal__docs glass-dark"
            :icon="mdiSpotify"
            iconRight="launch"
            label="PKCE auth flow"
            outline
            rounded
            target="_blank"
            rel="noopener noreferrer"
            aria-label="(Opens in a new tab)"
          />
        </p>

        <p class="text-body1 q-mb-lg">
          Account information <em class="text-italic">will not</em> be stored
          outside of a given session.
        </p>

        <p class="text-body1 q-mb-lg">
          Account information <em class="text-italic">will not</em> be used
          outside of the Fractoid web app.
        </p>

        <p class="text-body1 q-mb-lg">
          View the Fractoid source code on
          <QBtn
            href="https://github.com/SeanFree/Fractoid"
            class="SpotifyLoginModal__github glass-dark"
            :icon="mdiGithub"
            iconRight="launch"
            label="GitHub"
            outline
            rounded
            target="_blank"
            rel="noopener noreferrer"
            aria-label="(Opens in a new tab)"
          />
        </p>
      </QCardSection>

      <QCardActions align="right" class="text-teal q-pa-md flex justify-center">
        <QBtn
          class="SpotifyLoginModal__connect text-bold q-mr-lg"
          :iconRight="mdiSpotify"
          :icon="mdiConnection"
          label="Connect"
          outline
          rounded
          size="lg"
          @click="spotify.authenticate"
        >
        </QBtn>
        <QBtn
          class="SpotifyLoginModal__cancel text-bold"
          label="Cancel"
          flat
          rounded
          size="lg"
          @click="() => modals.hide(name)"
        >
        </QBtn>
      </QCardActions>
    </QCard>
  </QDialog>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import {
  QBtn,
  QCard,
  QCardActions,
  QCardSection,
  QDialog,
  QIcon,
  QImg,
} from 'quasar'
import { mdiConnection, mdiGithub, mdiSpotify } from '@quasar/extras/mdi-v6'

import { useModalsStore } from '@/stores/modals'
import { useSpotifyStore } from '@/stores/spotify'
import { FractoidLogo } from '@/components'

const name = 'spotifyLogin'

const modals = useModalsStore()
const spotify = useSpotifyStore()

const visible = computed(() => modals.getVisibility(name))

onMounted(() => {
  modals.add(name)
})
</script>

<style lang="scss" scoped>
.SpotifyLoginModal {
  &__body {
    background: $spotify-black !important;
    max-width: 80vw !important;
    padding: 45px !important;
  }

  &__banner {
    padding: 0 !important;
  }

  &__logo {
    flex-shrink: 0;
  }

  &__fractoidLogo {
    padding: 0 !important;
  }

  &__github,
  &__docs {
    padding-left: 8px;
  }

  &__cancel {
    padding: 0 16px !important;
  }

  &__connect {
    background: $spotify-black !important;
    color: $spotify-green !important;
    padding: 0 10px 0 18px !important;

    &:hover {
      background: $spotify-black !important;
    }
  }
}
</style>
