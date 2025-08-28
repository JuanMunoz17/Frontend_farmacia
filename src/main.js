import { createApp } from 'vue'
import './style.css'
import { router } from './router/router'
import Layout from './modules/shared/layout/Layout.vue'

createApp(Layout).use(router).mount('#app')
