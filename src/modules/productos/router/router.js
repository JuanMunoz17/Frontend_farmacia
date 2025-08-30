import { Component } from "react";



export const ProductosRoutes = [
    {
        path:'',
        Component: ()  => import('../componentes/ProductoForm.vue')
    }
]