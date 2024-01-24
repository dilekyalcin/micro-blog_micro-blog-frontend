import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas, faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { store } from "./store/index"

library.add(fas, faHeart)

const app = createApp(App)

app.use(router)
app.use(store);
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
