import { defineStore } from 'pinia'

export type DrawerName = 'info' | 'media' | 'shaders' | 'playlist' | 'equalizer'

export const useDrawersStore = defineStore('drawers', {
  state: () => ({
    info: {
      visible: false,
    },
    equalizer: {
      visible: false,
    },
    media: {
      visible: false,
    },
    shaders: {
      visible: true,
    },
    playlist: {
      visible: false,
    },
  }),

  actions: {
    toggleVisibility(name: DrawerName): void {
      this[name].visible = !this[name].visible
    },
  },
})
