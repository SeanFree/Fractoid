export interface SpotifyBearerToken {
  access_token: string
  expires_in: number
  token_type: 'Bearer'
}

export interface SpotifyExternalUrls {
  spotify: string
  [name: string]: string
}

export interface SpotifyTrack {
  album: {
    album_group: string
    album_type: string
    artists: {
      external_urls: SpotifyExternalUrls
      href: string
      id: string
      name: string
      type: string
      uri: string
    }[]
    available_markets: string[]
    external_urls: SpotifyExternalUrls
    href: string
    images: {
      height: number
      url: string
      width: string
    }[]
    name: string
    release_date: string
    release_date_precision: string
    total_tracks: number
    type: string
    uri: string
  }
  artists: {
    external_urls: SpotifyExternalUrls
    href: string
    id: string
    name: string
    type: string
    uri: string
  }[]
  available_markets: string[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_ids: {
    [type: string]: string
  }
  external_urls: SpotifyExternalUrls
  href: string
  id: string
  is_local: boolean
  name: string
  popularity: number
  preview_url: string
  track_number: number
  type: string
  uri: string
}

export interface SpotifySearchResults {
  tracks: {
    href: string
    items: SpotifyTrack[]
    limit: number
    next: string | null
    offset: number
    previous: string | null
    total: number
  }
}
