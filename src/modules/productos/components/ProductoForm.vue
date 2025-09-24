<!-- src/components/ProductoForm.vue (actualizado) -->
<template>
  <div class="max-w-4xl mx-auto">
    <div class="bg-white rounded-lg p-6">
      <h3 class="text-xl font-semibold text-gray-800 mb-6">
        {{ modoEdicion ? "Editar Producto" : "Registro de Producto" }}
      </h3>

      <!-- Contenedor con scroll -->
      <div class="max-h-96 overflow-y-auto pr-2">
        <form @submit.prevent="guardar" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Código Interno -->
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Código Interno *</label
              >
              <input
                v-model.trim="form.cod_interno"
                type="text"
                required
                maxlength="30"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
                placeholder="Ej: PROD001"
              />
            </div>

            <!-- Nombre -->
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Nombre *</label
              >
              <input
                v-model.trim="form.nombre"
                type="text"
                required
                maxlength="30"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
                placeholder="Nombre del producto"
              />
            </div>

            <!-- Presentación -->
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Presentación *</label
              >
              <input
                v-model.trim="form.presentacion"
                type="text"
                required
                maxlength="30"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
                placeholder="Ej: Tableta, Cápsula, etc."
              />
            </div>

            <!-- Tipo Producto (envía ENTERO) -->
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Tipo Producto *</label
              >
              <select
                v-model.number="form.tipo_producto"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
                :disabled="cargandoTipos"
              >
                <option :value="null" disabled>
                  {{
                    cargandoTipos ? "Cargando tipos..." : "Seleccione un tipo"
                  }}
                </option>
                <option
                  v-for="tipo in tiposProducto"
                  :key="tipo.id"
                  :value="tipo.id"
                >
                  {{ tipo.clasificacion || `Tipo ${tipo.id}` }}
                </option>
              </select>

              <!-- Mensajes de estado -->
              <p v-if="errorTipos" class="text-xs text-red-500 mt-1">
                Error cargando tipos de producto.
                <button
                  @click="recargarTipos"
                  class="text-blue-500 underline hover:text-blue-700"
                  type="button"
                >
                  Reintentar
                </button>
              </p>
              <p
                v-else-if="!cargandoTipos && tiposProducto.length === 0"
                class="text-xs text-yellow-600 mt-1"
              >
                No se encontraron tipos de producto disponibles.
              </p>
              <p
                v-else-if="!cargandoTipos && tiposProducto.length > 0"
                class="text-xs text-green-600 mt-1"
              >
                {{ tiposProducto.length }} tipos disponibles
              </p>
            </div>

            <!-- Marca-->
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Marca *</label
              >
              <input
                v-model.trim="form.marca"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
                placeholder="Ingrese el nombre de marca (texto)"
              />
            </div>

            <!-- Fábrica -->
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Fábrica *</label
              >
              <input
                v-model.trim="form.fabrica"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
                placeholder="Nombre de la fábrica"
              />
            </div>

            <!-- Registro INVIMA -->
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Registro INVIMA</label
              >
              <input
                v-model.trim="form.registro_invima"
                type="text"
                maxlength="60"
                :pattern="patronInvima"
                title="Solo letras y números"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
                placeholder="Registro INVIMA (opcional)"
              />
            </div>

            <!-- CUM -->
            <div>
              <label class="block text-sm font-medium text-gray-700">CUM</label>
              <input
                v-model.trim="form.cum"
                type="text"
                maxlength="30"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
                placeholder="Código CUM (opcional)"
              />
            </div>

            <!-- ATC -->
            <div>
              <label class="block text-sm font-medium text-gray-700">ATC</label>
              <input
                v-model.trim="form.atc"
                type="text"
                maxlength="30"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
                placeholder="Código ATC (opcional)"
              />
            </div>

            <!-- Estado -->
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Estado</label
              >
              <select
                v-model="form.estado"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
              >
                <option :value="true">Activo</option>
                <option :value="false">Inactivo</option>
              </select>
            </div>

            <!-- Observación de Precio -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700"
                >Observación de Precio *</label
              >
              <textarea
                v-model.trim="form.observacion_precio"
                rows="3"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
                placeholder="Descripción del precio, condiciones especiales, etc."
              ></textarea>
            </div>
          </div>
        </form>
      </div>

      <!-- Botones fijos en la parte inferior -->
      <div class="flex justify-end gap-3 pt-4 border-t mt-6">
        <button
          type="button"
          @click="resetForm"
          class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
          :disabled="guardando"
        >
          Limpiar
        </button>
        <button
          type="submit"
          @click="guardar"
          :disabled="guardando || (cargandoTipos && !form.tipo_producto)"
          class="px-6 py-2 rounded-lg text-white font-semibold transition duration-200"
          :class="{
            'bg-blue-500 hover:bg-blue-600': !guardando,
            'bg-gray-400 cursor-not-allowed': guardando,
          }"
        >
          <span v-if="guardando" class="flex items-center gap-2">
            <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Guardando...
          </span>
          <span v-else>{{
            modoEdicion ? "Actualizar Producto" : "Guardar Producto"
          }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import ProductoServicio from "../services/ProductoServicio";
import TipoProductoServicio from "../services/TipoProductoServicio";

const productoSvc = new ProductoServicio();
const tipoProductoSvc = new TipoProductoServicio();

export default {
  name: "ProductoForm",
  emits: ["saved", "close"],
  props: {
    editId: { type: [Number, String], default: null },
    producto: { type: Object, default: () => ({}) },
    modoEdicion: { type: Boolean, default: false },
  },
  data() {
    return {
      // Patrón para validación de INVIMA
      patronInvima: "^[A-Za-z0-9\\s]*$",

      // Datos del formulario (alineados con modelo/serializer)
      form: {
        cod_interno: "",
        nombre: "",
        presentacion: "",
        tipo_producto: null, // ENTERO (FK)
        marca: "", // ← usar marca (no 'marca_id')
        fabrica: "",
        registro_invima: "",
        cum: "",
        atc: "",
        estado: true,
        // ❌ eliminado: fecha_vencimiento
        observacion_precio: "",
      },

      // Estados de carga
      cargandoTipos: false,
      errorTipos: false,
      guardando: false,

      // Lista de tipos
      tiposProducto: [],
    };
  },
  async created() {
    // Cargar tipos de producto al crear el componente
    await this.cargarTiposProducto();

    // Si es modo edición, cargar datos del producto
    if (this.modoEdicion) {
      if (this.editId) {
        await this.cargarProducto();
      } else if (this.producto && Object.keys(this.producto).length > 0) {
        this.llenarFormulario(this.producto);
      }
    }
  },
  methods: {
    async cargarTiposProducto() {
      this.cargandoTipos = true;
      this.errorTipos = false;

      try {
        const tipos = await tipoProductoSvc.listarTodos();
        // Normalizar: debe ser array simple con {id, clasificacion}
        this.tiposProducto = Array.isArray(tipos)
          ? tipos
          : Array.isArray(tipos?.results)
          ? tipos.results
          : [];
        if (this.tiposProducto.length === 0) {
          toast.warning("No se encontraron tipos de producto disponibles", {
            position: "bottom-right",
            autoClose: 3000,
          });
        }
      } catch (error) {
        console.error("❌ Error cargando tipos de producto:", error);
        this.errorTipos = true;
        this.tiposProducto = [];
        toast.error("Error cargando tipos de producto", {
          position: "bottom-right",
          autoClose: 4000,
        });
      } finally {
        this.cargandoTipos = false;
      }
    },

    async cargarProducto() {
      try {
        const p = await productoSvc.obtenerProducto(this.editId);
        this.llenarFormulario(p);
      } catch (error) {
        console.error("❌ Error cargando producto:", error);
        toast.error("Error cargando producto para edición", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    },

    llenarFormulario(producto) {
      // Aceptar distintas formas que puede devolver el backend en 'tipo_producto'
      const tipoId =
        producto.tipo_producto?.id ??
        producto.tipo_producto ??
        producto.tipo_producto_id ??
        null;

      this.form = {
        cod_interno: producto.cod_interno ?? "",
        nombre: producto.nombre ?? "",
        presentacion: producto.presentacion ?? "",
        tipo_producto: Number.isInteger(tipoId)
          ? tipoId
          : Number(tipoId) || null,
        marca_id: producto.marca_id ?? "",
        fabrica: producto.fabrica ?? "",
        registro_invima: producto.registro_invima ?? "",
        cum: producto.cum ?? "",
        atc: producto.atc ?? "",
        estado: producto.estado ?? true,
        // ❌ eliminado: fecha_vencimiento
        observacion_precio: producto.observacion_precio ?? "",
      };
    },

    async guardar() {
      // Validar campos obligatorios
      const obligatorios = [
        { campo: "cod_interno", nombre: "Código Interno" },
        { campo: "nombre", nombre: "Nombre" },
        { campo: "presentacion", nombre: "Presentación" },
        { campo: "tipo_producto", nombre: "Tipo Producto" },
        { campo: "marca_id", nombre: "Marca / Identificador" },
        { campo: "fabrica", nombre: "Fábrica" },
        { campo: "observacion_precio", nombre: "Observación de Precio" },
      ];

      const faltantes = obligatorios.filter(({ campo }) => {
        const val = this.form[campo];
        return val === null || String(val).trim() === "";
      });

      if (faltantes.length > 0) {
        const nombres = faltantes.map((f) => f.nombre).join(", ");
        toast.warning(`Completa los campos obligatorios: ${nombres}`, {
          position: "bottom-right",
          autoClose: 4000,
        });
        return;
      }

      // Validar que tipo_producto sea un número válido
      const tipoId = Number(this.form.tipo_producto);
      if (!tipoId || isNaN(tipoId) || tipoId <= 0) {
        toast.warning("Selecciona un tipo de producto válido", {
          position: "bottom-right",
          autoClose: 2500,
        });
        return;
      }

      this.guardando = true;

      try {
        // Asegurar que enviamos el entero
        const payload = { ...this.form, tipo_producto: tipoId };

        let resultado;
        if (this.modoEdicion && (this.editId || this.producto?.id)) {
          const id = this.editId || this.producto.id;
          resultado = await productoSvc.editarProducto(id, payload, true);
        } else {
          resultado = await productoSvc.crearProducto(payload);
        }

        toast.success(
          `Producto ${
            this.modoEdicion ? "actualizado" : "guardado"
          } exitosamente`,
          { position: "bottom-right", autoClose: 2000 }
        );

        this.$emit("saved", resultado);
        if (!this.modoEdicion) this.resetForm();
      } catch (error) {
        console.error("❌ Error guardando producto:", error);

        let mensaje = "Error al guardar el producto. Intente nuevamente.";
        const data = error?.response?.data;
        if (typeof data === "string") {
          mensaje = data;
        } else if (data?.detail) {
          mensaje = data.detail;
        } else if (data?.non_field_errors) {
          mensaje = Array.isArray(data.non_field_errors)
            ? data.non_field_errors.join(", ")
            : data.non_field_errors;
        } else if (data && typeof data === "object") {
          const errores = Object.entries(data)
            .map(
              ([campo, msgs]) =>
                `${campo}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`
            )
            .join(" | ");
          if (errores) mensaje = errores;
        }

        toast.error(mensaje, { position: "bottom-right", autoClose: 5000 });
      } finally {
        this.guardando = false;
      }
    },

    resetForm() {
      this.form = {
        cod_interno: "",
        nombre: "",
        presentacion: "",
        tipo_producto: null,
        marca_id: "",
        fabrica: "",
        registro_invima: "",
        cum: "",
        atc: "",
        estado: true,
        // ❌ eliminado: fecha_vencimiento
        observacion_precio: "",
      };
      toast.info("Formulario reiniciado", {
        position: "bottom-right",
        autoClose: 1500,
      });
    },

    async recargarTipos() {
      await this.cargarTiposProducto();
    },
  },
};
</script>

<style scoped>
/* Estilo personalizado para el scroll */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
