import { createApp } from 'vue'
import './style.css'
import { router } from './router/router'
import Layout from './Layout.vue'

createApp(Layout).use(router).mount('#app')
