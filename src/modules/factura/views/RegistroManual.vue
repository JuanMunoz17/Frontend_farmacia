<template>
  <div class="max-w-6xl mx-auto">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <div class="border-b border-gray-200 pb-4 mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Registro Manual de Facturas</h2>
        <p class="mt-2 text-sm text-gray-600">
          Ingresa manualmente los datos de la factura
        </p>
      </div>

      <!-- Formulario de factura -->
      <form @submit.prevent="guardarFactura" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">No. Factura *</label>
            <input
              v-model.trim="factura.no_factura"
              type="text"
              inputmode="numeric"
              required
              maxlength="30"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Solo números"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha *</label>
            <input
              v-model="factura.fecha_factura"
              type="date"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Proveedor *</label>
            <select
              v-model.number="factura.proveedor"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option :value="null">Seleccionar proveedor</option>
              <option v-for="p in proveedoresOpts" :key="p.id" :value="p.id">
                {{ p.nombre }}
              </option>
            </select>
          </div>

          <div class="md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-2">Observación</label>
            <input
              v-model.trim="factura.observacion"
              type="text"
              maxlength="255"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Opcional"
            />
          </div>
        </div>

        <!-- Detalles -->
        <div class="border-t pt-6">
          <div class="flex justify-between items-center mb-4">
            <h4 class="text-lg font-medium text-gray-800">Detalle de la Factura</h4>
            <button
              type="button"
              @click="agregarDetalle"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Agregar Producto
            </button>
          </div>

          <div
            v-for="(det, index) in factura.detalles"
            :key="index"
            class="bg-gray-50 rounded-lg p-4 mb-4"
          >
            <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Producto</label>
                <select
                  v-model.number="det.producto"
                  required
                  class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option :value="null">Seleccionar</option>
                  <option v-for="prod in productosOpts" :key="prod.id" :value="prod.id">
                    {{ prod.nombre }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Valor Unidad</label>
                <input
                  v-model.number="det.valor_uni"
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
                <label class="block text-sm font-medium text-gray-700 mb-1">Valor IVA</label>
                <input
                  v-model.number="det.valor_iva"
                  type="number"
                  step="0.001"
                  min="0"
                  readonly
                  class="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Valor Facturado</label>
                <input
                  v-model.number="det.valor_facturado"
                  type="number"
                  step="0.001"
                  min="0"
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
            :disabled="cargando"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="cargando">Guardando...</span>
            <span v-else>Guardar Factura</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

// Servicios
import { FacturaServicio} from '../services/FacturaServicio'
import { ProveedoresServicio } from '../../proveedores/services/ProveedoresServicio'
import { ProductoServicio } from '../../productos/services/ProductoServicio'

const facturaSrv = new FacturaServicio()
const proveedorSrv = new ProveedoresServicio()
const productoSrv = new ProductoServicio()

export default {
  name: 'RegistroManual',
  data() {
    return {
      proveedoresOpts: [],
      productosOpts: [],
      factura: {
        no_factura: '',
        fecha_factura: '',
        proveedor: null, // ID
        observacion: '',
        detalles: [],
      },
      cargando: false,
    }
  },
  async created() {
    try {
      const [prov, prod] = await Promise.all([
        proveedorSrv.buscarProveedores({ pagina: 1, tamanio: 50 }),
        productoSrv.buscarProductos({ pagina: 1, tamanio: 50 }),
      ])
      this.proveedoresOpts = Array.isArray(prov?.results) ? prov.results : prov || []
      this.productosOpts = Array.isArray(prod?.results) ? prod.results : prod || []
    } catch (e) {
      toast.error('Error cargando catálogos', { autoClose: 3000 })
    }
    this.agregarDetalle()
  },
  methods: {
    agregarDetalle() {
      this.factura.detalles.push({
        producto: null,
        valor_uni: 0,
        iva: 0,
        valor_iva: 0,
        valor_facturado: 0,
      })
    },
    eliminarDetalle(index) {
      this.factura.detalles.splice(index, 1)
      if (this.factura.detalles.length === 0) this.agregarDetalle()
    },
    recalcular(det) {
      const vu = Number(det.valor_uni || 0)
      const ivaPct = Number(det.iva || 0)
      det.valor_iva = Number(((vu * ivaPct) / 100).toFixed(3))
      det.valor_facturado = Number((vu + det.valor_iva).toFixed(3))
    },
    async guardarFactura() {
      // Validación mínima
      if (!/^\d+$/.test(this.factura.no_factura)) {
        toast.warning('No. de factura debe ser numérico', { autoClose: 2500 })
        return
      }
      if (!this.factura.proveedor) {
        toast.warning('Selecciona un proveedor', { autoClose: 2500 })
        return
      }
      if (!this.factura.detalles.every((d) => d.producto != null)) {
        toast.warning('Cada ítem debe tener producto', { autoClose: 2500 })
        return
      }

      const payload = {
        no_factura: this.factura.no_factura,
        fecha_factura: this.factura.fecha_factura,
        proveedor: this.factura.proveedor, // ID
        observacion: this.factura.observacion,
        detalles: this.factura.detalles.map((d) => ({
          producto: d.producto, // ID
          valor_uni: d.valor_uni,
          iva: d.iva,
          valor_iva: d.valor_iva,
          valor_facturado: d.valor_facturado,
        })),
      }

      const loadingId = toast.loading('Guardando factura...')
      this.cargando = true
      try {
        await facturaSrv.crearFactura(payload)
        toast.update(loadingId, {
          render: 'Factura creada con éxito ✅',
          type: 'success',
          isLoading: false,
          autoClose: 2500,
        })
        this.resetForm()
      } catch (error) {
        const msg =
          error?.data?.detail ||
          error?.data?.non_field_errors?.[0] ||
          'No fue posible crear la factura'
        toast.update(loadingId, { render: `Error: ${msg}`, type: 'error', isLoading: false, autoClose: 3500 })
      } finally {
        this.cargando = false
      }
    },
    resetForm() {
      this.factura = {
        no_factura: '',
        fecha_factura: '',
        proveedor: null,
        observacion: '',
        detalles: [],
      }
      this.agregarDetalle()
      toast.info('Formulario reiniciado', { autoClose: 2000 })
    },
  },
}
</script>