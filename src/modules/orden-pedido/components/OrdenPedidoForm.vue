<!-- src/components/OrdenPedidoForm.vue -->
<template>
  <div class="max-w-6xl mx-auto">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h3 class="text-xl font-semibold text-gray-800 mb-6">Orden de Pedido</h3>

      <form @submit.prevent="guardarOrden" class="space-y-6">
        <!-- Información General -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Número de Orden *</label>
            <input
              v-model.trim="orden.no_orden"
              type="text"
              required
              maxlength="30"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Número de orden"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha de Orden *</label>
            <input
              v-model="orden.fecha_orden"
              type="date"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Proveedor *</label>
            <select
              v-model.number="orden.proveedor"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option :value="null">Seleccionar proveedor</option>
              <option v-for="p in proveedores" :key="p.id" :value="p.id">
                {{ p.nombre }}
              </option>
            </select>
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Descripción Interna</label>
            <input
              v-model.trim="orden.descripcion_interno"
              type="text"
              maxlength="60"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Descripción interna de la orden"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Estado de Aprobación</label>
            <select
              v-model="orden.aprobado"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option :value="null">Seleccionar estado</option>
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
                  v-model.number="det.producto"
                  required
                  class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option :value="null">Seleccionar</option>
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
                  step="0.001"
                  min="0"
                  class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  @input="recalcular(det)"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">IVA (%)</label>
                <input
                  v-model.number="det.iva"
                  type="number"
                  step="1"
                  min="0"
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
                  v-model.trim="det.descripcion_orden"
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
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

// ajusta la ruta si tu alias '@' difiere
import { OrdenPedidoServicio } from '../services/OrdenPedidoServicio'
import { ProveedoresServicio } from '../../proveedores/services/ProveedoresServicio'
import { ProductoServicio} from '../../productos/services/ProductoServicio'

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
        proveedor: null, // ID
        descripcion_interno: '',
        aprobado: null, // boolean|null
        detalles: [],
      },
      cargando: false,
    }
  },
  async created() {
    try {
      const [provRes, prodRes] = await Promise.all([
        proveedorSrv.buscarProveedores({ pagina: 1, tamanio: 50 }),
        productoSrv.buscarProductos({ pagina: 1, tamanio: 50 }),
      ])
      // Soporta ambos shapes (paginado o lista simple)
      this.proveedores = Array.isArray(provRes?.results) ? provRes.results : provRes || []
      this.productos = Array.isArray(prodRes?.results) ? prodRes.results : prodRes || []
    } catch (e) {
      toast.error('Error cargando catálogos', { autoClose: 3000 })
    }
    this.agregarDetalle()
  },
  methods: {
    agregarDetalle() {
      this.orden.detalles.push({
        producto: null, // ID
        cantidad_solicitada: 1,
        descripcion_orden: '',
        valor_unidad: 0,
        iva: 0,
        valor_iva: 0,
        valor_total: 0,
      })
    },
    eliminarDetalle(index) {
      this.orden.detalles.splice(index, 1)
      if (this.orden.detalles.length === 0) this.agregarDetalle()
    },
    recalcular(det) {
      const cant = Number(det.cantidad_solicitada || 0)
      const vu = Number(det.valor_unidad || 0)
      const ivaPct = Number(det.iva || 0)
      const base = cant * vu
      det.valor_iva = Number(((base * ivaPct) / 100).toFixed(3))
      det.valor_total = Number((base + det.valor_iva).toFixed(3))
    },
    async guardarOrden() {
      // Validación mínima en el front
      if (!this.orden.proveedor) {
        toast.warning('Selecciona un proveedor', { autoClose: 2500 })
        return
      }
      if (!this.orden.detalles.every((d) => d.producto && d.cantidad_solicitada > 0)) {
        toast.warning('Completa producto y cantidad en todos los detalles', { autoClose: 2500 })
        return
      }

      const payload = {
        no_orden: this.orden.no_orden,
        fecha_orden: this.orden.fecha_orden,
        proveedor: this.orden.proveedor, // 👈 ID del proveedor
        descripcion_interno: this.orden.descripcion_interno,
        aprobado: this.orden.aprobado === null ? false : this.orden.aprobado,
        detalles: this.orden.detalles.map((d) => ({
          producto: d.producto, // 👈 ID del producto
          cantidad_solicitada: d.cantidad_solicitada,
          descripcion_orden: d.descripcion_orden,
          valor_unidad: d.valor_unidad,
          iva: d.iva,
          valor_iva: d.valor_iva,
          valor_total: d.valor_total,
        })),
      }

      const loadingId = toast.loading('Guardando orden...')
      this.cargando = true
      try {
        await ordenSrv.crearOrden(payload)
        toast.update(loadingId, {
          render: 'Orden creada con éxito ✅',
          type: 'success',
          isLoading: false,
          autoClose: 2500,
        })
        this.resetForm()
      } catch (error) {
        const msg =
          error?.data?.detail ||
          error?.data?.non_field_errors?.[0] ||
          'No fue posible crear la orden'
        toast.update(loadingId, { render: `Error: ${msg}`, type: 'error', isLoading: false, autoClose: 3500 })
      } finally {
        this.cargando = false
      }
    },
    resetForm() {
      this.orden = {
        no_orden: '',
        fecha_orden: '',
        proveedor: null,
        descripcion_interno: '',
        aprobado: null,
        detalles: [],
      }
      this.agregarDetalle()
      toast.info('Formulario reiniciado', { autoClose: 2000 })
    },
  },
}
</script>
