import { createApp } from 'vue'
import './style.css'
import { router } from './router/router'
import Layout from './modules/shared/layout/Layout.vue'
import Vue3Toastify, { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const app = createApp(Layout)
app.use(router)
app.use(Vue3Toastify, {
  autoClose: 3000,
  position: toast.POSITION.TOP_RIGHT,
})
app.mount('#app')
