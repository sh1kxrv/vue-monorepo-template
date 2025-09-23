import { createWebHistory } from 'vue-router'
import { createRouter } from '@mono/shared'
import { HomeView } from '#/views/home'

const router = createRouter({
  history: createWebHistory(),
  routes: [HomeView],
  global: [],
  middleware: true,
})

export default router
