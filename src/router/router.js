import { createWebHistory, createRouter } from 'vue-router'

import App from '../App.vue'
import { FacturaRoutes } from '../modules/factura/router/router.js'
import { ordenPedidoRoutes } from '../modules/orden-pedido/router/router.js'
import { ProveedoresRoutes } from '../modules/proveedores/router/router.js'
import { ProductosRoutes } from '../modules/productos/router/router.js'


const routes = [
    { path: '/', component: App },
/*     { path: '/rutaProtegida', component: App, meta: {
            requiresAuth: true,
        } 
    },
    { path: '/verActa/:idActa/:modoOscuro', component: App },
 */
    {
        path: '/orden-pedido',
        children: [
            ...ordenPedidoRoutes,
        ]
    },
    {
        path: '/factura',
        children: [
            ...FacturaRoutes,
        ]
    },
    {
        path: '/proveedores',
        children: [
            ...ProveedoresRoutes,
        ]
    },
    {
        path:'/productos',
        children: [
            ...ProductosRoutes
        ]
    }
]

console.log(routes)

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