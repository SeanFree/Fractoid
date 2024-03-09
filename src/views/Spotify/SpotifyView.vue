<template>
  <QPageContainer class="SpotifyView fit">
    <QCard
      v-if="spotify.isConnected"
      class="SpotifyView__body fit flex column glass-dark"
      flat
    >
      <QCardSection horizontal class="q-my-md q-ml-md">
        <QInput
          class="SpotifyView__searchInput"
          color="green"
          dense
          label="Search Spotify"
          labelColor="green"
          placeholder="Artist, Album, or Title"
          outlined
          rounded
          :modelValue="searchString"
          @update:modelValue="onSearchInput"
        >
          <template #prepend>
            <QIcon color="green" size="24px">
              <svg>
                <path :d="mdiSpotify"></path>
              </svg>
            </QIcon>
          </template>

          <template #append>
            <QIcon name="search" size="24px" />
          </template>
        </QInput>
      </QCardSection>

      <QScrollArea class="SpotifySearch__scrollArea">
        <QCardSection>
          <QItemLabel class="text-h5 q-mb-md">Tracks</QItemLabel>

          <QBtn @click="onPause">Pause</QBtn>

          <ul class="TrackList flex align-center wrap">
            <li
              class="TrackList__item"
              v-for="item in searchResults?.tracks.items"
              :key="item.id"
            >
              <QCard flat>
                <QImg
                  :src="
                    item.album.images.sort((a, b) => b.height - a.height)[0]
                      ?.url || ''
                  "
                  width="200px"
                  height="200px"
                  @click="() => fetchTrack(item.id)"
                ></QImg>
                <QItemLabel class="text-body1 q-pa-sm" lines="1">
                  {{ item.name }}
                </QItemLabel>
                <QItemLabel class="text-body1 q-pa-sm" lines="1">
                  {{
                    item.artists.reduce(
                      (acc, artist) => acc + `${acc ? ', ' : ''}${artist.name}`,
                      ''
                    )
                  }}
                </QItemLabel>
              </QCard>
            </li>
          </ul>
        </QCardSection>
      </QScrollArea>
    </QCard>
  </QPageContainer>
</template>

<script lang="ts" setup>
import { onBeforeMount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  QBtn,
  QCard,
  QCardSection,
  QIcon,
  QImg,
  QInput,
  QItem,
  QItemLabel,
  QPageContainer,
  QScrollArea,
  debounce,
} from 'quasar'
import { useSpotifyStore } from '@/stores'
import { mdiSpotify } from '@quasar/extras/mdi-v6'
import type { SpotifySearchResults } from '@/types'
import { SpotifyWebPlayer } from '@/program/spotify/SpotifyWebPlayer'

const spotify = useSpotifyStore()
const router = useRouter()

const searchString = ref()
const searchResults = ref<SpotifySearchResults>()
const player = ref<SpotifyWebPlayer>()

const onSearchInput = debounce((value: string | number | null) => {
  spotify
    .searchByTitle(value as string)
    .then((res: any) => {
      searchResults.value = res.data
    })
    .catch((e: any) => console.error(e))
}, 500)

const fetchTrack = async (id: string) => {
  const result = await spotify.fetchTrack(id)
  console.log(result)
}

const onPause = () => {
  console.log('pause')
  player.value?.pause()
}

onBeforeMount(() => {
  if (!spotify.isConnected) {
    router.replace('/spotify/login')
  } else {
    player.value = new SpotifyWebPlayer(
      spotify.client.accessToken?.access_token as string
    )
  }
})

onMounted(() => {
  const { search } = window.location
})
</script>

<style lang="scss" scoped>
.SpotifyView {
  height: 100%;

  &__body {
    background-color: transparentize($spotify-black, 0.1) !important;
  }

  &__searchInput {
    color: $spotify-green !important;
    max-width: 400px;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
}

.ArtistList,
.TrackList {
  gap: 24px;

  &__item {
    width: 200px;
  }
}

.SpotifySearch {
  &__scrollArea {
    height: calc(100% - 72px);
  }
}
</style>
