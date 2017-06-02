import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 一级路由
import Neighbor from '../view/main/index.vue'
import Media from '../view/main/media.vue'

const routes = [
  {
    path: '',
    redirect: {
      name: 'neighbor'
    }
  },
  {
    path: '/neighbor',
    name: 'neighbor',
    components: {
      main: Neighbor
    }
  },
  {
    path: '/neighbor/:neighborId',
    name: 'neighbor-one',
    components: {
      main: Neighbor
    }
  },
  {
    path: '/media',
    name: 'media',
    components: {
      main: Media
    }
  },
]

const router = new VueRouter ({
  routes
})

export default router
