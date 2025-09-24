<template>
  <div class="max-w-8xl mx-auto py-10">
    <!-- Encabezado y botón alineados -->
    <div
      class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 px-6"
    >
      <h2 class="text-2xl font-bold text-gray-800">Actas</h2>
      <button
        @click="mostrarFormulario = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition duration-200"
      >
        Nueva Acta
      </button>
    </div>

    <!-- Barra de búsqueda y contador -->
    <div
        class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4 px-6"
    >
    <div class="flex-1">
        <input
            v-model="busqueda"
            @keyup.enter="buscarActas"
            type="text"
            placeholder="Buscar por numero acta o persona recepción..."
            class="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
        />
    </div>
    <div class="flex-1 text-right text-gray-500 text-sm mt-2 md:mt-0">
        Mostrando {{ actasFiltradas.length }} de {{ actas.length }} actas
    </div>
    </div>

    <!-- Tabla alineada con el encabezado -->
    <div class="px-6">
        <ActaTable :actas="actasFiltradas" />
    </div>

    <!-- Modal Formulario Acta -->
    <div
        v-if="mostrarFormulario"
        class="fixed inset-0 z-50 flex items-center justify-center shadow-2xl bg-[rgba(0,0,0,0.5)]"
        @click.self="cerrarFormulario"
    >
    <div
        class="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative animate-fade-in overflow-y-auto max-h-[90vh]"
    >
        <button
            @click="cerrarFormulario"
            class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold"
        >
            &times;
        </button>
        <ActaForm @close="cerrarFormulario" />
    </div>
    </div>
</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import ActaTable from "../components/ActaTable.vue";
import ActaForm from "../components/ActaForm.vue";
import { ActaServicio } from "../services/ActasServicio";

const actaSrv = new ActaServicio();
const actas = ref([]);
const busqueda = ref("");
const mostrarFormulario = ref(false);

function cerrarFormulario() {
  mostrarFormulario.value = false;
}

// Cargar todas las actas al montar
const cargarActas = async () => {
  const res = await actaSrv.buscarActas({ pagina: 1, tamanio: 1000 });
  let lista = Array.isArray(res.results) ? res.results : [];
  // Ordenar por id ascendente
  lista.sort((a, b) => a.id - b.id);
  actas.value = lista;
};

onMounted(cargarActas);

// Filtrar actas por número de acta o persona recepción
const actasFiltradas = computed(() => {
  if (!busqueda.value.trim()) return actas.value;
  const texto = busqueda.value.trim().toLowerCase();
  return actas.value.filter(
    (a) =>
      String(a.no_acta).toLowerCase().includes(texto) ||
      String(a.persona_recepcion).toLowerCase().includes(texto)
  );
});

const buscarActas = () => {
  // El filtrado es reactivo, pero puedes forzar la recarga si usas backend
  // cargarActas();
};
</script>
