<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative border border-blue-200 transition-all"
    >
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 text-blue-400 hover:text-blue-600 transition-colors"
        title="Cerrar"
      >
        <svg
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="w-7 h-7"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <h4 class="text-xl font-bold text-blue-700 mb-6 text-center">
        {{ tipo === "factura" ? "Facturas vinculadas" : "Órdenes vinculadas" }}
      </h4>
      <div v-if="loading" class="flex justify-center items-center py-8">
        <span class="text-blue-400 animate-pulse">Cargando...</span>
      </div>
      <div v-else>
        <div
          v-if="relaciones.length === 0"
          class="text-blue-300 text-center py-6"
        >
          No hay registros vinculados.
        </div>
        <ul v-else class="space-y-3 max-h-72 overflow-y-auto">
          <li
            v-for="rel in relaciones"
            :key="rel.id"
            class="border border-blue-100 rounded-xl p-4 bg-blue-50 flex flex-col gap-2 shadow-sm"
          >
            <template v-if="tipo === 'factura'">
              <div class="flex items-center gap-2">
                <span class="font-semibold text-blue-700">Factura:</span>
                <span class="text-gray-700">{{ rel.factura }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-semibold text-blue-700">ID Vinculo:</span>
                <span class="text-gray-700">{{ rel.id }}</span>
              </div>
            </template>
            <template v-else>
              <div class="flex items-center gap-2">
                <span class="font-semibold text-green-700">Orden:</span>
                <span class="text-gray-700">{{ rel.orden_pedido }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-semibold text-green-700">ID Vinculo:</span>
                <span class="text-gray-700">{{ rel.id }}</span>
              </div>
            </template>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import {
  ActaOrdenServicio,
  ActaFacturaServicio,
} from "../services/ActasServicio";

const props = defineProps({
  tipo: { type: String, required: true }, // 'factura' o 'orden'
  actaId: { type: Number, required: true },
});

const relaciones = ref([]);
const loading = ref(true);

watch(
  () => [props.tipo, props.actaId],
  async () => {
    loading.value = true;
    if (props.tipo === "factura") {
      const srv = new ActaFacturaServicio();
      const res = await srv.buscarVinculos({ acta: props.actaId });
      relaciones.value = Array.isArray(res.results) ? res.results : [];
    } else {
      const srv = new ActaOrdenServicio();
      const res = await srv.buscarVinculos({ acta: props.actaId });
      relaciones.value = Array.isArray(res.results) ? res.results : [];
    }
    loading.value = false;
  },
  { immediate: true }
);
</script>
