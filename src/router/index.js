/**
 * router/index.js
 *
 * Manual routes. Every page is lazy-loaded so the first load stays small.
 */

import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Home', component: () => import('@/pages/Home.vue') },
  { path: '/about', name: 'AboutPage', component: () => import('@/pages/About.vue') },
  { path: '/contact', name: 'ContactPage', component: () => import('@/pages/Contact.vue') },
  { path: '/request-sale', name: 'RequestSale', component: () => import('@/pages/Contact.vue') },

  // Product flow: categories (/product) -> list with filters -> detail
  {
    path: '/product',
    name: 'Product',
    component: () => import('@/pages/Product2.vue'),
  },
  {
    path: '/product-search',
    name: 'ProductSearch',
    component: () => import('@/pages/Product.vue'),
  },
  {
    path: '/product-list',
    name: 'ProductList',
    component: () => import('@/pages/ProductList.vue'),
  },
  {
    path: '/product-detail/:name',
    name: 'ProductDetail',
    component: () => import('@/pages/ProductDetail.vue'),
  },

  // Unknown URL -> home
  { path: '/:pathMatch(.*)*', redirect: { name: 'Home' } },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      // กดปุ่มย้อนกลับ/ไปข้างหน้า จะเลื่อนไปยังตำแหน่งที่เคยอยู่
      return savedPosition
    }
    // เปลี่ยนหน้าใหม่ เลื่อนไปบนสุด
    return { top: 0 }
  },
})

// Workaround for https://github.com/vitejs/vite/issues/11804
// (needed now that pages are lazy-loaded: after a new deploy, old chunks disappear)
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
