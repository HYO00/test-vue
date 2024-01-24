import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './routes/index'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import VNetworkGraph from "v-network-graph";
import 'vuetify/styles'
import "v-network-graph/lib/style.css"
import "./style/index.css"



async function enableMocking() {
    if (process.env.NODE_ENV !== 'development') {
      return
    }
   
    const { worker } = await import('./mocks/browser')
   
    // `worker.start()` returns a Promise that resolves
    // once the Service Worker is up and ready to intercept requests.
    return worker.start()
}

enableMocking().then(() => {
    const app = createApp(App)
    const vuetify = createVuetify({
        components,
        directives,
    })
    const pinia = createPinia()

    app.use(VNetworkGraph).use(router).use(vuetify).use(pinia).use(VueQueryPlugin)
    app.mount('#app')
})

