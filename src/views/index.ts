import { SpotifyRoutes } from './Spotify'
import MainView from './MainView.vue'

export const routes = [
  ...SpotifyRoutes,
  {
    path: '/',
    component: MainView,
  },
]
