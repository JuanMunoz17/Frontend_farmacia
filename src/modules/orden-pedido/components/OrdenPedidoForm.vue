<template>
  <div class="max-w-6xl mx-auto">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h3 class="text-xl font-semibold text-gray-800 mb-6">Orden de Pedido</h3>
      
      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- Información General -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Número de Orden *
            </label>
            <input 
              v-model="form.no_orden" 
              type="text" 
              required
              maxlength="30"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Número de orden"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Orden *
            </label>
            <input 
              v-model="form.fecha_orden" 
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
              v-model="form.proveedor" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar proveedor</option>
              <option value="1">Proveedor 1</option>
              <option value="2">Proveedor 2</option>
            </select>
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Descripción Interna
            </label>
            <input 
              v-model="form.descripcion_interno" 
              type="text" 
              maxlength="60"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Descripción interna de la orden"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Estado de Aprobación
            </label>
            <select 
              v-model="form.aprobado" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar estado</option>
              <option :value="true">Aprobado</option>
              <option :value="false">Pendiente</option>
            </select>
          </div>
        </div>

        <!-- Detalles de la Orden -->
        <div class="border-t pt-6">
          <div class="flex justify-between items-center mb-4">
            <h4 class="text-lg font-medium text-gray-800">Detalles de la Orden</h4>
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
                <label class="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                <input 
                  v-model="detail.cantidad_solicitada" 
                  type="number" 
                  min="1"
                  class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Valor Unitario</label>
                <input 
                  v-model="detail.valor_unidad" 
                  type="number" 
                  step="0.01"
                  class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">IVA (%)</label>
                <input 
                  v-model="detail.iva" 
                  type="number" 
                  step="0.01"
                  class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Valor Total</label>
                <input 
                  :value="calculateDetailTotal(detail)" 
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

              <div class="md:col-span-6">
                <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea 
                  v-model="detail.descripcion_orden" 
                  rows="2"
                  class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="Descripción del producto en la orden"
                ></textarea>
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
          >
            Guardar Orden
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  no_orden: '',
  fecha_orden: '',
  proveedor: '',
  descripcion_interno: '',
  aprobado: '',
  detalles: []
})

const addDetail = () => {
  form.value.detalles.push({
    producto_id: '',
    cantidad_solicitada: 1,
    descripcion_orden: '',
    valor_unidad: 0,
    iva: 0,
    valor_iva: 0,
    valor_total: 0
  })
}

const removeDetail = (index) => {
  form.value.detalles.splice(index, 1)
}

const calculateDetailTotal = (detail) => {
  const subtotal = (detail.cantidad_solicitada || 0) * (detail.valor_unidad || 0)
  const ivaAmount = subtotal * ((detail.iva || 0) / 100)
  return (subtotal + ivaAmount).toFixed(2)
}

const submitForm = () => {
  console.log('Orden a guardar:', form.value)
  alert('Orden de pedido guardada exitosamente')
  resetForm()
}

const resetForm = () => {
  form.value = {
    no_orden: '',
    fecha_orden: '',
    proveedor: '',
    descripcion_interno: '',
    aprobado: '',
    detalles: []
  }
}

// Agregar un detalle inicial
addDetail()
</script>
