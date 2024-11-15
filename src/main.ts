import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar } from 'quasar'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

import App from './App.vue'

import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

import 'primeicons/primeicons.css'

import '@/index.css'

const app = createApp(App)

app.use(createPinia())
app.use(Quasar)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})

app.mount('#app')
