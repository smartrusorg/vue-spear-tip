import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
// import Home from '../views/Home.vue'
import About from './About.vue'
import Guide from './Guides.vue'
import Donate from './Donate.vue'

import guidesRoutes from './Guides/guides.routes'
import kitRoutes from './Kit/kit.routes'

for (const guide of guidesRoutes) {
  guide.path = `/guides${guide.path}`
}
for (const kit of kitRoutes) {
  kit.path = `/kit${kit.path}`
}
const GuidesRoutes = guidesRoutes
const KitRoutes = kitRoutes
export  {
  GuidesRoutes,
  KitRoutes
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Vue Spear Tip',
    component: About
  },
  {
    path: '/guide',
    name: 'Guide',
    component: Guide
  },
  {
    path: '/donate',
    name: 'Donate',
    component: Donate
  }
]

// console.log([...routes, ...guidesRoutes, ...kitRoutes])

const router = createRouter({
  history: createWebHistory(),
  routes: [...routes, ...guidesRoutes, ...kitRoutes] as any
})
export default router