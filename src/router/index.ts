import { createRouter, createWebHistory } from 'vue-router'
import BeautyPageant from '../views/BeautyPageant.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/beauty',
      name: '选美大赛',
      component: BeautyPageant
    },
  ]
})

export default router
