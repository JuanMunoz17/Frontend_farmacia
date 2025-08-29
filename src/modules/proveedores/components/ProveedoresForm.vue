<template>
  <div class="max-w-4xl mx-auto">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h3 class="text-xl font-semibold text-gray-800 mb-6">Registro de Proveedores</h3>
      
      <form @submit.prevent="guardarProveedor" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Tipo Documento</label>
            <select v-model="form.tipo_documento" required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500">
              <option value="">Seleccione</option>
              <option value="1">CC</option>
              <option value="2">NIT</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">No. Documento</label>
            <input v-model="form.no_documento" type="text" required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Nombre</label>
            <input v-model="form.nombre" type="text" required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Teléfono</label>
            <input v-model="form.telefono" type="text" required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500" />
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700">Correo</label>
            <input v-model="form.correo" type="email" required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500" />
          </div>
        </div>

        <!-- Mensajes de estado -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">{{ error }}</p>
            </div>
          </div>
        </div>

        <div v-if="success" class="bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-green-700">{{ success }}</p>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-4 mt-6">
          <button type="reset" @click="resetForm" :disabled="isLoading"
            class="px-6 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
            Limpiar
          </button>
          <button type="submit" :disabled="isLoading"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            <svg v-if="isLoading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ProveedoresServicio } from '@proveedores/services/ProveedoresServicio.js'

const form = ref({
  tipo_documento: '',
  no_documento: '',
  nombre: '',
  telefono: '',
  correo: ''
})

const isLoading = ref(false)
const error = ref('')
const success = ref('')

// Instancia del servicio
const proveedoresService = new ProveedoresServicio()

const guardarProveedor = async () => {
  // Limpiar mensajes previos
  error.value = ''
  success.value = ''
  
  const proveedor = {
    tipo_documento: form.value.tipo_documento,
    no_documento: form.value.no_documento,
    nombre: form.value.nombre,
    telefono: form.value.telefono,
    correo: form.value.correo
  }

  // 👀 Verificación en consola
  console.log("Proveedor a guardar:", proveedor)

  try {
    isLoading.value = true
    
    // Llamada al servicio para crear el proveedor
    const resultado = await proveedoresService.crearProveedor(proveedor)
    
    console.log("Proveedor creado exitosamente:", resultado)
    success.value = 'Proveedor guardado exitosamente'
    
    // Limpiar formulario después de guardar
    resetForm()
    
  } catch (err) {
    console.error("Error al guardar proveedor:", err)
    error.value = err.message || 'Error al guardar el proveedor. Intente nuevamente.'
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  form.value = {
    tipo_documento: '',
    no_documento: '',
    nombre: '',
    telefono: '',
    correo: ''
  }
  // Limpiar mensajes al resetear
  error.value = ''
  success.value = ''
}
</script>
