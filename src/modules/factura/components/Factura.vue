<template>
  <div class="max-w-6xl mx-auto">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h3 class="text-xl font-semibold text-gray-800 mb-6">Registro de Facturas</h3>
      
      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- Información General -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Número de Factura *
            </label>
            <input 
              v-model="form.no_factura" 
              type="text" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Número de factura"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Factura *
            </label>
            <input 
              v-model="form.fecha_factura" 
              type="date" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Proveedor *
            </label>
            <select 
              v-model="form.proveedor_id" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar proveedor</option>
              <option value="1">Proveedor 1</option>
              <option value="2">Proveedor 2</option>
            </select>
          </div>

          <div class="md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Observaciones
            </label>
            <textarea 
              v-model="form.observacion" 
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Observaciones de la factura"
            ></textarea>
          </div>
        </div>

        <!-- Carga de Archivo XML (Drag & Drop) -->
        <div class="border-t pt-6">
          <h4 class="text-lg font-medium text-gray-800 mb-4">Archivo XML de la factura</h4>

          <div class="relative">
            <input
              ref="fileInput"
              type="file"
              accept=".xml,application/xml,text/xml"
              class="hidden"
              @change="onFileChange"
            />

            <div class="group">
              <div
                @click="triggerBrowse"
                @dragover.prevent="dragging = true"
                @dragleave.prevent="dragging = false"
                @drop.prevent="handleDrop"
                :class="[
                  'w-full border-2 border-dashed rounded-xl p-8 text-center transition',
                  dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50',
                ]"
                role="button"
                tabindex="0"
                @keydown.enter.prevent="triggerBrowse"
                @keydown.space.prevent="triggerBrowse"
              >
                <div class="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M3 15a4 4 0 014-4h1m0 0a4 4 0 118 0h1a4 4 0 014 4v2a3 3 0 01-3 3H6a3 3 0 01-3-3v-2z" />
                  </svg>
                  <p class="text-sm text-gray-700">
                    Arrastra y suelta tu archivo <span class="font-medium">.xml</span> aquí
                    o <span class="text-blue-600 font-medium underline">haz clic para buscar</span>
                  </p>
                  <p class="text-xs text-gray-500">Máximo 5&nbsp;MB. Solo se admite 1 archivo.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Mensaje de error -->
          <p v-if="fileError" class="mt-3 text-sm text-red-600">
            {{ fileError }}
          </p>

          <!-- Lista de archivos (solo 1) -->
          <div v-if="uploadedFile" class="mt-4">
            <div class="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100">
                  <span class="text-sm font-semibold text-blue-700 uppercase">{{ fileExtension(uploadedFile.name) }}</span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-800">
                    {{ uploadedFile.name }}
                  </p>
                  <p class="text-xs text-gray-500">
                    Extensión: .{{ fileExtension(uploadedFile.name) }} · Peso: {{ formatBytes(uploadedFile.size) }}
                  </p>
                </div>
              </div>
              <button
                type="button"
                @click="removeFile"
                class="inline-flex items-center justify-center h-8 w-8 rounded-md border border-gray-300 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition"
                title="Quitar archivo"
                aria-label="Quitar archivo"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <!-- Detalles de la Factura -->
        <div class="border-t pt-6">
          <div class="flex justify-between items-center mb-4">
            <h4 class="text-lg font-medium text-gray-800">Detalles de la Factura</h4>
            <button 
              type="button" 
              @click="addDetail"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Agregar Producto
            </button>
          </div>

          <div v-for="(detail, index) in form.detalles" :key="index" class="bg-gray-50 rounded-lg p-4 mb-4">
            <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Producto</label>
                <select 
                  v-model="detail.producto_id" 
                  class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="">Seleccionar</option>
                  <option value="1">Producto 1</option>
                  <option value="2">Producto 2</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Valor Unitario</label>
                <input 
                  v-model="detail.valor_uni" 
                  type="number" 
                  step="0.01"
                  @input="calculateDetailValues(detail)"
                  class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">IVA (%)</label>
                <input 
                  v-model="detail.iva" 
                  type="number" 
                  step="0.01"
                  @input="calculateDetailValues(detail)"
                  class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Valor IVA</label>
                <input 
                  v-model="detail.valor_iva" 
                  type="number" 
                  readonly
                  class="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Valor Facturado</label>
                <input 
                  v-model="detail.valor_facturado" 
                  type="number" 
                  readonly
                  class="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                />
              </div>

              <div class="flex items-end">
                <button 
                  type="button" 
                  @click="removeDetail(index)"
                  class="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>

          <!-- Total de la Factura -->
          <div class="bg-blue-50 rounded-lg p-4 mt-4">
            <div class="flex justify-end">
              <div class="text-right">
                <p class="text-lg font-semibold text-gray-800">
                  Total Factura: ${{ calculateTotal().toFixed(2) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Botones -->
        <div class="flex justify-end space-x-4 pt-6 border-t">
          <button 
            type="button" 
            @click="resetForm"
            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Limpiar
          </button>
          <button 
            type="submit"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Guardando...' : 'Guardar Factura' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { FacturaServicio } from '../services/FacturaServicio'
import { toast } from 'vue3-toastify'

const MAX_SIZE = 5 * 1024 * 1024 // 5MB

const form = ref({
  no_factura: '',
  fecha_factura: '',
  proveedor_id: '',
  observacion: '',
  detalles: []
})

const isLoading = ref(false)

const facturaSrv = new FacturaServicio()

/* ---------- Upload XML (1 archivo) ---------- */
const fileInput = ref(null)
const uploadedFile = ref(null)     // File | null
const fileError = ref('')
const dragging = ref(false)

const triggerBrowse = () => {
  fileInput.value?.click()
}

const onFileChange = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  tryAttachFile(file)
  // limpiar el input para permitir volver a seleccionar el mismo archivo si se elimina
  e.target.value = ''
}

const handleDrop = (e) => {
  dragging.value = false
  const dt = e.dataTransfer
  if (!dt || !dt.files?.length) return
  const file = dt.files[0]
  tryAttachFile(file)
}

const tryAttachFile = (file) => {
  fileError.value = ''
  const isXmlByExt = file.name.toLowerCase().endsWith('.xml')
  const isXmlByMime = (file.type || '').includes('xml') // text/xml o application/xml
  if (!isXmlByExt && !isXmlByMime) {
    fileError.value = 'Solo se permiten archivos con extensión .xml'
    uploadedFile.value = null
    return
  }
  if (file.size > MAX_SIZE) {
    fileError.value = 'El archivo supera el límite de 5 MB'
    uploadedFile.value = null
    return
  }
  // Solo 1 archivo: reemplaza si ya existe
  uploadedFile.value = file
}

const removeFile = () => {
  uploadedFile.value = null
  fileError.value = ''
}

const fileExtension = (name) => {
  const parts = name.split('.')
  return parts.length > 1 ? parts.pop().toLowerCase() : ''
}

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 2)} ${sizes[i]}`
}

/* ---------- Detalles ---------- */
const addDetail = () => {
  form.value.detalles.push({
    producto_id: '',
    valor_uni: 0,
    iva: 0,
    valor_iva: 0,
    valor_facturado: 0
  })
}

const removeDetail = (index) => {
  form.value.detalles.splice(index, 1)
}

const calculateDetailValues = (detail) => {
  const valorUni = parseFloat(detail.valor_uni) || 0
  const ivaPercent = parseFloat(detail.iva) || 0
  
  detail.valor_iva = (valorUni * (ivaPercent / 100)).toFixed(2)
  detail.valor_facturado = (valorUni + parseFloat(detail.valor_iva)).toFixed(2)
}

const calculateTotal = () => {
  return form.value.detalles.reduce((total, detail) => {
    return total + (parseFloat(detail.valor_facturado) || 0)
  }, 0)
}

/* ---------- Envío del formulario ---------- */
const submitForm = async () => {
  // Validación: archivo XML requerido opcional
  // if (!uploadedFile.value) {
  //   fileError.value = 'Debe adjuntar el XML de la factura.'
  //   return
  // }

  // Validar detalles
  if (!form.value.detalles.length) {
    toast.error('Debe agregar al menos un producto a la factura.')
    return
  }

  // Mapear detalles para el servicio
  const detallesMapped = form.value.detalles.map(d => ({
    producto: Number(d.producto_id),
    valor_uni: parseFloat(d.valor_uni) || 0,
    iva: Number(d.iva) || 0,
    valor_iva: parseFloat(d.valor_iva) || 0,
    valor_facturado: parseFloat(d.valor_facturado) || 0
  }))

  isLoading.value = true
  try {
    await facturaSrv.crearFacturaConDetalles({
      no_factura: form.value.no_factura,
      fecha_factura: form.value.fecha_factura,
      observacion: form.value.observacion,
      detalles: detallesMapped
    })
    toast.success('Factura guardada exitosamente')
    resetForm()
  } catch (error) {
    console.error('Error al guardar la factura:', error)
    toast.error('Error al guardar la factura. Por favor, intente nuevamente.')
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  form.value = {
    no_factura: '',
    fecha_factura: '',
    proveedor_id: '',
    observacion: '',
    detalles: []
  }
  uploadedFile.value = null
  fileError.value = ''
  dragging.value = false
}

// Agregar un detalle inicial
addDetail()
</script>
