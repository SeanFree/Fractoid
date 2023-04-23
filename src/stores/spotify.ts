import { defineStore } from 'pinia'
import { ref } from 'vue'

import { SpotifyClient } from '@/program/spotify/SpotifyClient'

export const useSpotifyStore = defineStore('spotify', () => {
  const isInitialized = ref<boolean>(false)
  const isConnected = ref<boolean>(false)
  const client = ref<SpotifyClient>(new SpotifyClient())

  // const

  const search = (query: string) => {
    // return client.value?.search(query)
    return []
  }

  const authenticate = () => client.value?.authenticate()
  const fetchAccessToken = () => client.value?.fetchAccessToken()

  return {
    authenticate,
    fetchAccessToken,
    isInitialized,
    isConnected,
    search,
  }
})
