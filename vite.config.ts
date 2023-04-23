import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import vue from '@vitejs/plugin-vue'

import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: true,
    port: 8080,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    basicSsl(),
    vue({
      template: { transformAssetUrls },
    }),
    quasar({
      sassVariables: 'src/styles/quasar.scss',
    }),
  ],
})
