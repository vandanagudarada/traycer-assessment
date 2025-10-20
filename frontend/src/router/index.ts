import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home/index.vue')
  },
  {
    path: '/planning',
    name: 'Planning',
    component: () => import('../views/Planning/index.vue')
  },
  {
    path: '/planning/:id',
    name: 'PlanningEdit',
    component: () => import('../views/Planning/index.vue')
  },
  {
    path: '/plans',
    name: 'Plans',
    component: () => import('../views/Plans/index.vue')
  },
  {
    path: '/templates',
    name: 'Templates',
    component: () => import('../views/Templates/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

