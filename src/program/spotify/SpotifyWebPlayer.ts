const SPOTIFY_WEB_PLAYER_SDK_URL = 'https://sdk.scdn.co/spotify-player.js'

export class SpotifyWebPlayer {
  player: Spotify.Player | null = null

  constructor(token: string) {
    if (!this.player) {
      const script = document.createElement('script')

      script.src = SPOTIFY_WEB_PLAYER_SDK_URL
      script.async = true

      document.body.appendChild(script)

      window.onSpotifyWebPlaybackSDKReady = () => {
        this.player = new Spotify.Player({
          name: 'Web Playback SDK',
          getOAuthToken: (cb) => {
            cb(token)
          },
          volume: 0.5,
        })

        this.player.addListener('ready', ({ device_id }) => {
          console.log('Ready with Device ID', device_id)
        })

        this.player.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id)
        })

        this.player.connect().then(() => {
          this.player?.activateElement()
        })
      }
    }
  }

  pause() {
    this.player?.pause()
  }
}
