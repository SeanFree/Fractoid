import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Dark, Quasar } from 'quasar'

import App from './App.vue'

import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

import '@/styles/base.scss'

const app = createApp(App)

app.use(createPinia())
app.use(Quasar)

Dark.set(true)

app.mount('#app')
