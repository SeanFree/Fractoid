import { createRouter, createWebHistory } from 'vue-router'

import { routes } from '@/views'

export default createRouter({
  history: createWebHistory(),
  routes,
})
