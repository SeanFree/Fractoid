import { getRandomString } from '@/utils'
import {
  SPOTIFY_API_BASE_URL,
  SPOTIFY_AUTH_BASE_URL,
  SPOTIFY_AUTH_TOKEN_URL,
  SPOTIFY_CLIENT_ID,
} from '@/consts'
import type { SpotifySearchResults } from '@/types'

import axios, { type AxiosInstance } from 'axios'

const defaultSearchTypes = ['album', 'artist', 'track']
const LOCAL_STORAGE_CODE_VERIFIER_KEY = 'Fractoid:code_verifier'
const LOCAL_STORAGE_ACCESS_TOKEN_KEY = 'Fractoid:access_token'

interface SpotifyAccessToken {
  access_token: string
  expires_in: number
  refresh_token: string
  scope: string
  token_type: string
}
export class SpotifyApi {
  private client: AxiosInstance
  private accessCode: string | null
  accessToken: SpotifyAccessToken | null
  private PKCECodeVerifier: string | null

  constructor() {
    // const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY)
    const codeVerifier = localStorage.getItem(LOCAL_STORAGE_CODE_VERIFIER_KEY)

    this.accessCode = null
    this.accessToken = null // accessToken
    this.PKCECodeVerifier = codeVerifier

    this.client = axios.create({
      baseURL: SPOTIFY_API_BASE_URL,
    })
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
      this.client.defaults.headers.Authorization = `${this.accessToken.token_type} ${this.accessToken.access_token}`
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
        redirect_uri: 'https://localhost:8080/spotify/login',
        response_type: 'code',
        scope: 'user-read-private user-read-email streaming',
        state: getRandomString(16),
      })

      window.location.href = `${SPOTIFY_AUTH_BASE_URL}?${params}`
    }
  }

  async fetchAccessToken(code: string): Promise<void> {
    if (!this.accessToken) {
      const cv = this.PKCECodeVerifier as string

      this.accessCode = code

      const body = new URLSearchParams({
        client_id: SPOTIFY_CLIENT_ID,
        code,
        code_verifier: cv,
        grant_type: 'authorization_code',
        redirect_uri: 'https://localhost:8080/spotify/login',
      })

      const response = await axios.post<SpotifyAccessToken>(
        SPOTIFY_AUTH_TOKEN_URL,
        body,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )

      this.accessToken = response.data

      this.setAccessTokenHeader()
    }
  }

  async refreshAccessToken() {
    // const body =
  }

  fetchProfile() {
    return this.client.get
  }

  fetchTrack(id: string) {
    return this.client.get(`/tracks/${id}`)
  }

  searchByTitle(query: string) {
    return this.client.get<SpotifySearchResults>(
      `/search?q=${query}&type=track&limit=20`
    )
  }
}
