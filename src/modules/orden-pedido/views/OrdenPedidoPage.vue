<template>
  <PageRenderer
    title="Orden de Pedido"
    :component="OrdenPedidoForm"
    :componentProps="{}"
  />
</template>

<script setup>
import PageRenderer from '@/pages/PageRenderer.vue'
import { defineAsyncComponent } from 'vue'

// Carga diferida del formulario de Orden de Pedido
const OrdenPedidoForm = defineAsyncComponent(() => import('@/components/OrdenPedidoForm.vue'))
</script>

<style scoped>
</style>
