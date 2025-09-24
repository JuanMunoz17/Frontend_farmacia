<template>
  <div class="max-w-8xl mx-auto py-10 px-6">
    <div class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-blue-600">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-white uppercase"
            >
              ID
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-white uppercase"
            >
              No. Acta
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-white uppercase"
            >
              Recepcionó
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-white uppercase"
            >
              OPC
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-white uppercase"
            >
              Fecha
            </th>
            <th
              class="px-6 py-3 text-center text-xs font-medium text-white uppercase"
            >
              Facturas
            </th>
            <th
              class="px-6 py-3 text-center text-xs font-medium text-white uppercase"
            >
              Órdenes
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="acta in actasPaginadas"
            :key="acta.id"
            class="hover:bg-blue-50 transition"
          >
            <td class="px-6 py-4 whitespace-nowrap">{{ acta.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ acta.no_acta }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ acta.persona_recepcion }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">{{ acta.opc }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ acta.fecha_acta }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-center">
              <button
                @click="verRelacion(acta.id, 'factura')"
                class="text-blue-600 hover:text-blue-800 transition-colors p-2 rounded-full hover:bg-blue-50"
                title="Ver facturas"
              >
                <svg
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 4-4.5 7-9 7s-9-3-9-7a9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-center">
              <button
                @click="verRelacion(acta.id, 'orden')"
                class="text-green-600 hover:text-green-800 transition-colors p-2 rounded-full hover:bg-green-50"
                title="Ver órdenes"
              >
                <svg
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 4-4.5 7-9 7s-9-3-9-7a9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </td>
          </tr>
          <tr v-if="actas.length === 0">
            <td colspan="7" class="px-6 py-4 text-center text-gray-400">
              No se mostraron actas.
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Paginación -->
      <div
        class="flex flex-col md:flex-row md:justify-between items-center mt-6 gap-4"
      >
        <div class="text-gray-600 text-sm">
          Página {{ paginaActual }} de {{ totalPaginas }}
        </div>
        <div class="flex gap-2">
          <button
            @click="paginaActual--"
            :disabled="paginaActual === 1"
            class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            @click="paginaActual++"
            :disabled="paginaActual === totalPaginas || totalPaginas === 0"
            class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
      <ActaRelacionModal
        v-if="modalAbierto"
        :tipo="modalTipo"
        :actaId="modalActaId"
        @close="modalAbierto = false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { ActaServicio } from "../services/ActasServicio";
import ActaRelacionModal from "./ActaRelacionModal.vue";

const actaSrv = new ActaServicio();
const actas = ref([]);
const modalAbierto = ref(false);
const modalTipo = ref(""); // 'factura' o 'orden'
const modalActaId = ref(null);

const paginaActual = ref(1);
const tamanioPagina = 10;

const totalPaginas = computed(() =>
  Math.max(1, Math.ceil(actas.value.length / tamanioPagina))
);

const actasPaginadas = computed(() => {
  const start = (paginaActual.value - 1) * tamanioPagina;
  return actas.value.slice(start, start + tamanioPagina);
});

const cargarActas = async () => {
  const res = await actaSrv.buscarActas({ pagina: 1, tamanio: 1000 });
  let lista = Array.isArray(res.results) ? res.results : [];
  // Ordenar por id ascendente
  lista.sort((a, b) => a.id - b.id);
  actas.value = lista;
  paginaActual.value = 1;
};

const verRelacion = (actaId, tipo) => {
  modalActaId.value = actaId;
  modalTipo.value = tipo; 
  modalAbierto.value = true;
};

/*
const verRelacion = (actaId, tipo) => {
  modalActaId.value = actaId;
  modalTipo.value = tipo;
  modalAbierto.value = true;
};
*/

onMounted(cargarActas);
</script>
