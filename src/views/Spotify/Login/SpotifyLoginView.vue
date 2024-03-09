<template>
  <section class="SpotifyLoginView fit">
    <QCard class="SpotifyLoginView__body" flat>
      <QCardSection
        class="SpotifyLoginView__banner flex items-center no-wrap text-teal-4 q-mb-md"
      >
        <FractoidLogo class="SpotifyLoginView__fractoidLogo" />

        <QIcon class="q-mx-lg" color="white" size="xl" name="add" />

        <QImg
          class="SpotifyLoginView__logo"
          fit="contain"
          height="90px"
          src="/spotify-logo.svg"
          width="300px"
        />
      </QCardSection>

      <QCardSection class="SpotifyLoginView__content q-mb-md">
        <h2 class="text-h4 text-center q-mb-xl">Connect with Spotify</h2>

        <p class="text-body1 q-mb-lg">
          Fractoid can connect with your account via the
          <QBtn
            href="https://developer.spotify.com/documentation/web-api"
            class="SpotifyLoginView__docs glass-dark"
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
            class="SpotifyLoginView__docs glass-dark"
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
            class="SpotifyLoginView__github glass-dark"
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

      <QCardSection v-if="spotify.loginState === 'error'">
        <QItem class="flex align-center justify-around">
          <span class="q-mr-md text-red" role="presentation">
            {{ ErrorFace.getFace() }}
          </span>

          <p>Something went wrong connecting with Spotify</p>

          <span class="q-ml-md text-red" role="presentation">
            {{ ErrorFace.getFace() }}
          </span>
        </QItem>
      </QCardSection>

      <QCardActions align="center" class="text-teal q-pa-md">
        <QBtn
          class="SpotifyLoginView__connect text-bold q-mr-lg"
          :iconRight="mdiSpotify"
          :icon="mdiConnection"
          :label="spotify.loginState === 'error' ? 'Try Again' : 'Connect'"
          outline
          rounded
          size="lg"
          @click="spotify.authenticate"
        />

        <QBtn
          class="SpotifyLoginView__cancel text-bold"
          color="white"
          label="Cancel"
          flat
          rounded
          size="lg"
          to="/"
        />
      </QCardActions>
    </QCard>
  </section>
</template>

<script lang="ts" setup>
import { onBeforeMount, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import {
  QBtn,
  QCard,
  QCardActions,
  QCardSection,
  QIcon,
  QImg,
  QItem,
} from 'quasar'
import { mdiConnection, mdiGithub, mdiSpotify } from '@quasar/extras/mdi-v6'

import { useSpotifyStore, type LoginError } from '@/stores/spotify'
import { FractoidLogo } from '@/components'
import { ErrorFace } from '@/program/ErrorFace'

const spotify = useSpotifyStore()
const router = useRouter()

onBeforeMount(() => {
  if (spotify.isConnected) {
    router.replace('/spotify')
  } else if (router.currentRoute.value.query?.code) {
    const { code } = router.currentRoute.value.query

    spotify
      .fetchAccessToken(code as string)
      .then(() => {
        spotify.setLoginState('connected')

        router.replace('/spotify')
      })
      .catch((e) => {
        spotify.setLoginState('error', {
          error: e.message,
          state: '',
        })
      })
  } else if (router.currentRoute.value.query?.error) {
    const { error, state } = router.currentRoute.value.query

    spotify.setLoginState('error', { error, state } as LoginError)

    router.replace('/spotify/login')
  }
})

onBeforeUnmount(() => {
  if (spotify.loginState === 'error') {
    spotify.setLoginState('unset')
  }
})
</script>

<style lang="scss" scoped>
.SpotifyLoginView {
  &__body {
    background: $spotify-black !important;
    display: inline-block;
    height: unset !important;
    left: 50%;
    padding: 45px !important;
    position: relative;
    top: 50%;
    transform: translate(-50%, -50%);
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
