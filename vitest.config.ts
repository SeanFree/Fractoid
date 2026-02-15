import { defineVitestConfig } from '@nuxt/test-utils/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineVitestConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'nuxt',
    coverage: {
      provider: 'v8',
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
})
