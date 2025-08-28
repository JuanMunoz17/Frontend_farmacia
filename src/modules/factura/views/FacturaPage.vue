<template>
  <PageRenderer
    title="Factura"
    :component="FacturaForm"
    :componentProps="{}"
  >
    <!-- Ejemplo de acciones en header (opcional)
    <template #header-actions>
      <button class="px-3 py-2 text-sm border rounded-lg">Exportar</button>
    </template>
    -->
  </PageRenderer>
</template>

<script setup>
import PageRenderer from '@/pages/PageRenderer.vue'
import { defineAsyncComponent } from 'vue'

// Carga diferida del formulario de Factura
const FacturaForm = defineAsyncComponent(() => import('@/components/FacturaForm.vue'))
</script>

<style scoped>
</style>