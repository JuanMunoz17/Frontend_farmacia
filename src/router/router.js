import { createWebHistory, createRouter } from 'vue-router'

import App from '../App.vue'
import Login from '../views/Login.vue'

const routes = [
    { path: '/', component: App },
    { path: '/rutaProtegida', component: App, meta: {
            requiresAuth: true,
        } 
    },
    { path: '/login', component: Login},
    { path: '/verActa/:idActa/:modoOscuro', component: App },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, _, next) => {
    if(to.path === '/login'){
        next()
        return;
    }

    if(!to.meta?.requiresAuth){
        next()
        return;
    }

    const isLogeado = false;

    if(isLogeado){
        next()
        return;
    }
    
    router.push({
        path: '/login',
        query: {
            noSession: true,
        }
    })

})