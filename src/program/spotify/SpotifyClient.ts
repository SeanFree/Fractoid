import { getRandomString } from './../../utils/strings'
import {
  SPOTIFY_API_BASE_URL,
  SPOTIFY_AUTH_BASE_URL,
  SPOTIFY_AUTH_TOKEN_URL,
  SPOTIFY_CLIENT_ID,
} from '@/consts'
// import type { SpotifyBearerToken } from '@/types'

import axios, { AxiosError, type AxiosInstance } from 'axios'

const defaultSearchTypes = ['album', 'artist', 'track']
const LOCAL_STORAGE_CODE_VERIFIER_KEY = 'Fractoid:code_verifier'
const LOCAL_STORAGE_ACCESS_TOKEN_KEY = 'Fractoid:access_token'

export class SpotifyClient {
  private client: AxiosInstance
  private accessToken: string | null
  private PKCECodeVerifier: string | null

  constructor() {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY)
    const codeVerifier = localStorage.getItem(LOCAL_STORAGE_CODE_VERIFIER_KEY)

    this.accessToken = accessToken
    this.PKCECodeVerifier = codeVerifier

    this.client = axios.create({
      baseURL: SPOTIFY_API_BASE_URL,
    })

    this.setAccessTokenHeader()
  }

  private async generatePKCEChallenge(): Promise<string> {
    const base64encode = (digest: ArrayBuffer) => {
      return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')
    }

    const encoder = new TextEncoder()
    const data = encoder.encode(this.PKCECodeVerifier as string)
    const digest = await window.crypto.subtle.digest('SHA-256', data)

    return base64encode(digest)
  }

  private setAccessTokenHeader() {
    if (this.accessToken) {
      this.client.defaults.headers.Authorization = `Bearer: ${this.accessToken}`
    }
  }

  async authenticate(): Promise<void> {
    if (!this.accessToken) {
      this.PKCECodeVerifier = getRandomString(128)

      const challenge = await this.generatePKCEChallenge()

      localStorage.setItem(
        LOCAL_STORAGE_CODE_VERIFIER_KEY,
        this.PKCECodeVerifier
      )

      const params = new URLSearchParams({
        client_id: SPOTIFY_CLIENT_ID,
        code_challenge: challenge,
        code_challenge_method: 'S256',
        redirect_uri: 'https://localhost:8080/spotify',
        response_type: 'code',
        scope: 'user-read-private user-read-email',
        state: getRandomString(16),
      })

      window.location.href = `${SPOTIFY_AUTH_BASE_URL}?${params}`
    }
  }

  async fetchAccessToken(): Promise<void> {
    if (!this.accessToken) {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code') as string
      const cv = this.PKCECodeVerifier as string

      const body = new URLSearchParams({
        client_id: SPOTIFY_CLIENT_ID,
        code,
        code_verifier: cv,
        grant_type: 'authorization_code',
        redirect_uri: 'https://localhost:8080/spotify',
      })

      const response = await axios.post(SPOTIFY_AUTH_TOKEN_URL, body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      const accessToken = response.data

      console.log(accessToken)

      this.accessToken = accessToken
    }
  }

  async refreshAccessToken() {
    // const body =
  }

  async fetchProfile() {}

  search(query: string) {
    return this.client.get(
      `/search?q=${query}&type=${defaultSearchTypes.join()}`
    )
  }
}
