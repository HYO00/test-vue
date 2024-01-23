import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './routes/index'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import VNetworkGraph from "v-network-graph";
import "v-network-graph/lib/style.css"
import "./style/index.css"
import { createPinia } from 'pinia'

const app = createApp(App)
const vuetify = createVuetify({
    components,
    directives,
})
const pinia = createPinia()

app.use(VNetworkGraph)
app.use(router)
app.use(vuetify)
app.use(pinia);

app.mount('#app')