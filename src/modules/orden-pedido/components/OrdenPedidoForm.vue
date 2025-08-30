<template>
  <div class="max-w-6xl mx-auto">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h3 class="text-xl font-semibold text-gray-800 mb-6">Orden de Pedido</h3>
      
      <form @submit.prevent="guardarOrden" class="space-y-6">
        <!-- Información General -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Número de Orden *
            </label>
            <input 
              v-model="orden.no_orden" 
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
              v-model="orden.fecha_orden" 
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
              v-model="orden.proveedor" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar proveedor</option>
              <option v-for="p in proveedores" :key="p.id" :value="p.id">
                {{ p.nombre }}
              </option>
            </select>
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Descripción Interna
            </label>
            <input 
              v-model="orden.descripcion_interno" 
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
              v-model="orden.aprobado" 
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
              @click="agregarDetalle"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Agregar Producto
            </button>
          </div>

          <div v-for="(det, index) in orden.detalles" :key="index" class="bg-gray-50 rounded-lg p-4 mb-4">
            <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Producto</label>
                <select 
                  v-model="det.producto" 
                  required
                  class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="">Seleccionar</option>
                  <option v-for="prod in productos" :key="prod.id" :value="prod.id">
                    {{ prod.nombre }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                <input 
                  v-model.number="det.cantidad_solicitada" 
                  type="number" 
                  min="1"
                  class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  @input="recalcular(det)"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Valor Unitario</label>
                <input 
                  v-model.number="det.valor_unidad" 
                  type="number" 
                  step="0.01"
                  class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  @input="recalcular(det)"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">IVA (%)</label>
                <input 
                  v-model.number="det.iva" 
                  type="number" 
                  step="0.01"
                  class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  @input="recalcular(det)"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Valor Total</label>
                <input 
                  v-model.number="det.valor_total" 
                  type="number" 
                  readonly
                  class="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                />
              </div>

              <div class="flex items-end">
                <button 
                  type="button" 
                  @click="eliminarDetalle(index)"
                  class="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Eliminar
                </button>
              </div>

              <div class="md:col-span-6">
                <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea 
                  v-model="det.descripcion_orden" 
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

<script>
import { OrdenPedidoServicio } from '../services/OrdenPedidoServicio'
import { ProveedoresServicio } from '../../proveedores/services/ProveedoresServicio'
import { ProductoServicio } from '../../productos/services/ProductoServicio'

const ordenSrv = new OrdenPedidoServicio()
const proveedorSrv = new ProveedoresServicio()
const productoSrv = new ProductoServicio()

export default {
  name: 'OrdenPedidoForm',
  data() {
    return {
      proveedores: [],
      productos: [],
      orden: {
        no_orden: '',
        fecha_orden: '',
        descripcion_interno: '',
        aprobado: '',
        proveedor: '',
        detalles: []
      }
    }
  },
  async created() {
    try {
      this.proveedores = (await proveedorSrv.buscarProveedores()).results
      this.productos = (await productoSrv.buscarProductos()).results
    } catch (e) {
      console.error('Error cargando catálogos', e)
    }
    this.agregarDetalle() // detalle inicial
  },
  methods: {
    agregarDetalle() {
      this.orden.detalles.push({
        producto: '',
        cantidad_solicitada: 1,
        descripcion_orden: '',
        valor_unidad: 0,
        iva: 0,
        valor_iva: 0,
        valor_total: 0
      })
    },
    eliminarDetalle(index) {
      this.orden.detalles.splice(index, 1)
    },
    recalcular(det) {
      const cant = Number(det.cantidad_solicitada || 0)
      const vu = Number(det.valor_unidad || 0)
      const ivaPct = Number(det.iva || 0)
      const base = cant * vu
      det.valor_iva = Number(((base * ivaPct) / 100).toFixed(2))
      det.valor_total = Number((base + det.valor_iva).toFixed(2))
    },
    async guardarOrden() {
      try {
        // Construir el payload que espera el backend
        const payload = {
          no_orden: this.orden.no_orden,
          fecha_orden: this.orden.fecha_orden,
          descripcion_interno: this.orden.descripcion_interno,
          aprobado: this.orden.aprobado,
          detalles: this.orden.detalles.map(det => ({
            producto: det.producto, // ID del producto
            cantidad_solicitada: det.cantidad_solicitada,
            descripcion_orden: det.descripcion_orden,
            valor_unidad: det.valor_unidad,
            iva: det.iva,
            valor_iva: det.valor_iva,
            valor_total: det.valor_total
          }))
        }

        console.log('Payload a enviar:', payload)

        await ordenSrv.crearOrdenConDetalles(payload)
        alert('Orden creada con éxito ✅')
        this.resetForm()
      } catch (error) {
        console.error('Error al crear la orden ❌', error.response?.data || error)
        alert('Error al crear la orden ❌')
      }
    },
    resetForm() {
      this.orden = {
        no_orden: '',
        fecha_orden: '',
        descripcion_interno: '',
        aprobado: '',
        proveedor: '',
        detalles: []
      }
      this.agregarDetalle()
    }
  }
}
</script>
