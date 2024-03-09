import SpotifyLoginRoutes from './Login/SpotifyLoginView.routes'
import SpotifyView from './SpotifyView.vue'

export default [
  ...SpotifyLoginRoutes,
  {
    path: '/spotify',
    component: SpotifyView,
  },
]
