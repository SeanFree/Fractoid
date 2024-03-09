import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { SpotifyApi } from '@/program/spotify/SpotifyApi'

export type LoginState = 'unset' | 'error' | 'connected'
export interface LoginError {
  error: string
  state: string
}

export const useSpotifyStore = defineStore('spotify', () => {
  const client = ref<SpotifyApi>(new SpotifyApi())
  const isInitialized = ref<boolean>(false)
  const loginState = ref<LoginState>('unset')
  const loginError = ref<LoginError>()
  const isConnected = computed<boolean>(() => loginState.value === 'connected')

  const searchByTitle = (query: string) => {
    return client.value?.searchByTitle(query)
  }

  const fetchTrack = (id: string) => client?.value.fetchTrack(id)

  const authenticate = () => client.value?.authenticate()

  const fetchAccessToken = async (code: string) => {
    try {
      await client.value?.fetchAccessToken(code)

      loginState.value = 'connected'
    } catch (e: any) {
      loginState.value = 'error'
      loginError.value = {
        error: e.message,
        state: '',
      }
      console.error(e)
    }
  }

  const setLoginState = (value: LoginState, error?: LoginError) => {
    loginState.value = value
    loginError.value = error
  }

  return {
    client,
    authenticate,
    fetchAccessToken,
    isInitialized,
    isConnected,
    searchByTitle,
    fetchTrack,
    loginError,
    loginState,
    setLoginState,
  }
})
