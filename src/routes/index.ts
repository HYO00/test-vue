import  * as VueRouter from 'vue-router'
import Drop from '../components/Drop/Drop.vue';
import NewGraph from '../components/Drop/NewGraph.vue'
import CustomNode from '../components/Practice/CustomNode.vue';
import DragEdge from '../components/Practice/DragEdge.vue';
import ServerLayout from '../components/ServerLayout/ServerLayout.vue';
import ClusterNode from '../components/Practice/ClusterNode.vue'


const routes = [
  { path: '/', component:  NewGraph  },
  { path: '/vis', component: Drop, },
  { path: '/custom', component: CustomNode},
  { path: '/edge', component: DragEdge},
  { path: '/server', component:ServerLayout},
  { path: '/cluster', component:ClusterNode}

]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes, // short for `routes: routes`
})

export default router;