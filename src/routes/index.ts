import HelloWorld from '../components/HelloWorld.vue';
import  * as VueRouter from 'vue-router'
import Drop from '../components/Drop.vue';
const routes = [
  { path: '/hello', component: HelloWorld },
  { path: '/five', component: Drop },
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