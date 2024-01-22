import  * as VueRouter from 'vue-router'
import Drop from '../components/Drop.vue';
import NewGraph from '../components/NewGraph.vue'
import Drop1 from '../components/Drop1.vue';
// import Netwrok from '../components/Network.vue'

const routes = [
  { path: '/', component:  Drop1  },
  { path: '/five', component:Drop, },
  { path: '/new', component: NewGraph}
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = VueRouter.createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: VueRouter.createWebHashHistory(),
  routes, // short for `routes: routes`
})

export default router;