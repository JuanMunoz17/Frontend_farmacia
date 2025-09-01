<template>
  <div class="max-w-8xl mx-auto py-10 px-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
      <h2 class="text-2xl font-bold text-gray-800">Proveedores</h2>

      <button
        @click="mostrarFormulario = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition duration-200"
      >
        Nuevo Proveedor
      </button>
    </div>

    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
      <div class="flex-1">
        <input
          v-model="busqueda"
          @keyup.enter="buscarProveedores"
          type="text"
          placeholder="Buscar por nombre o documento..."
          class="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
        />
      </div>
      <div class="flex-1 text-right text-gray-500 text-sm mt-2 md:mt-0">
        Mostrando {{ proveedores.length }} de {{ total }} proveedores
      </div>
    </div>

    <!-- Tabla de proveedores -->
    <div class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-blue-600">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase">Tipo Doc</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase">No. Documento</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase">Nombre</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase">Teléfono</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase">Correo</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-white uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="proveedor in proveedores" :key="proveedor.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <span v-if="proveedor.tipo_documento === 1">CC</span>
              <span v-else-if="proveedor.tipo_documento === 2">NIT</span>
              <span v-else>-</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">{{ proveedor.no_documento }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ proveedor.nombre }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ proveedor.telefono }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ proveedor.correo }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-center">
              <button
                @click="editarProveedor(proveedor)"
                class="text-blue-600 hover:text-blue-800 transition-colors p-2 rounded-full hover:bg-blue-50"
                title="Editar proveedor"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
            </td>
          </tr>
          <tr v-if="proveedores.length === 0">
            <td colspan="6" class="px-6 py-4 text-center text-gray-400">No se encontraron proveedores.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div class="flex flex-col md:flex-row md:justify-between items-center mt-6 gap-4">
      <div class="text-gray-600 text-sm">
        Página {{ pagina }} de {{ totalPaginas }}
      </div>
      <div class="flex gap-2">
        <button
          @click="cambiarPagina(pagina - 1)"
          :disabled="pagina === 1"
          class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          @click="cambiarPagina(pagina + 1)"
          :disabled="pagina === totalPaginas || totalPaginas === 0"
          class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>

    <!-- Modal Formulario Proveedor -->
    <div v-if="mostrarFormulario" class="fixed inset-0 z-50 flex items-center justify-center shadow-2xl bg-[rgba(0,0,0,0.5)]">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative animate-fade-in">
        <button
          @click="cerrarFormulario"
          class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold"
        >
          &times;
        </button>
        <ProveedoresForm 
          @close="cerrarFormulario" 
          @saved="onProveedorGuardado" 
          :proveedor="proveedorAEditar"
          :modo-edicion="modoEdicion"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ProveedoresServicio } from '../services/ProveedoresServicio'
import ProveedoresForm from '../components/ProveedoresForm.vue'

const proveedoresService = new ProveedoresServicio()

const proveedores = ref([])
const total = ref(0)
const pagina = ref(1)
const tamanio = ref(10)
const busqueda = ref('')
const mostrarFormulario = ref(false)
const proveedorAEditar = ref(null)
const modoEdicion = ref(false)

const totalPaginas = computed(() => Math.ceil(total.value / tamanio.value))

const cargarProveedores = async () => {
  try {
    const params = {
      buscar: busqueda.value,
      pagina: pagina.value,
      tamanio: tamanio.value
    }
    const resp = await proveedoresService.buscarProveedores(params)
    proveedores.value = resp.results || []
    total.value = resp.count || 0
  } catch (e) {
    proveedores.value = []
    total.value = 0
  }
}

const buscarProveedores = () => {
  pagina.value = 1
  cargarProveedores()
}

const cambiarPagina = (nuevaPagina) => {
  if (nuevaPagina < 1 || nuevaPagina > totalPaginas.value) return
  pagina.value = nuevaPagina
  cargarProveedores()
}

const cerrarFormulario = () => {
  mostrarFormulario.value = false
  proveedorAEditar.value = null
  modoEdicion.value = false
}

const editarProveedor = (proveedor) => {
  proveedorAEditar.value = { ...proveedor }
  modoEdicion.value = true
  mostrarFormulario.value = true
}

const onProveedorGuardado = () => {
  cerrarFormulario()
  cargarProveedores()
}

onMounted(() => {
  cargarProveedores()
})
</script>




