import  * as VueRouter from 'vue-router'
import Drop from '../components/Drop/Drop.vue';
import NewGraph from '../components/Drop/NewGraph.vue'

const routes = [
  { path: '/', component:  NewGraph  },
  { path: '/vis', component: Drop, },

]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes, // short for `routes: routes`
})

export default router;