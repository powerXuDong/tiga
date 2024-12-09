import { createRouter, createWebHistory } from 'vue-router'
import BeautyPageant from '@/views/BeautyPageant.vue'
import LuckyPage from '@/views/LuckyPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/lucky'
    },
    {
      path: '/beauty',
      name: '选美大赛',
      component: BeautyPageant
    },
    {
      path: '/lucky',
      name: '管中窥豹',
      component: LuckyPage
    }
  ]
})

export default router
