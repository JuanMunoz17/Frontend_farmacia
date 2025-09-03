<!-- src/views/ProductosPage.vue -->
<template>
  <div class="max-w-8xl mx-auto py-10 px-6">
    <div
      class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4"
    >
      <h2 class="text-2xl font-bold text-gray-800">Productos</h2>
      <button
        @click="abrirModal"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition duration-200"
      >
        Nuevo Producto
      </button>
    </div>

    <!-- Barra de búsqueda unificada -->
    <div class="mb-6 bg-white rounded-lg shadow p-4">
      <div class="flex gap-4">
        <div class="flex-1">
          <input
            v-model.trim="busqueda"
            @input="buscarEnTiempoReal"
            placeholder="Buscar por nombre, código, presentación o marca..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>
        <button
          @click="limpiar"
          class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold transition duration-200"
        >
          Limpiar
        </button>
      </div>
    </div>

    <div
      class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4"
    >
      <div class="flex-1 text-gray-500 text-sm">
        Mostrando {{ productos.length }} de {{ total }} productos
      </div>
      <div
        v-if="cargando"
        class="text-blue-600 text-sm flex items-center gap-2"
      >
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
        Buscando...
      </div>
    </div>

    <!-- Tabla de productos -->
    <div class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-blue-600">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-white uppercase"
            >
              Código
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-white uppercase"
            >
              Nombre
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-white uppercase"
            >
              Presentación
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-white uppercase"
            >
              Marca
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-white uppercase"
            >
              Fábrica
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-white uppercase"
            >
              Estado
            </th>
            <th
              class="px-6 py-3 text-center text-xs font-medium text-white uppercase"
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="p in productos"
            :key="p.id"
            class="hover:bg-gray-50 transition-colors duration-150"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ p.cod_interno }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ p.nombre }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ p.presentacion }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ p.marca }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ p.fabrica }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="
                  p.estado
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                "
                class="px-2 py-1 rounded text-xs font-medium"
              >
                {{ p.estado ? "Activo" : "Inactivo" }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-center">
              <button
                @click="editarProducto(p)"
                class="text-blue-600 hover:text-blue-800 transition-colors p-2 rounded-full hover:bg-blue-50"
                title="Editar producto"
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  ></path>
                </svg>
              </button>
            </td>
          </tr>
          <tr v-if="!cargando && productos.length === 0">
            <td colspan="7" class="px-6 py-4 text-center text-gray-400">
              {{
                busqueda
                  ? "No se encontraron productos que coincidan con la búsqueda."
                  : "No se encontraron productos."
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div
      class="flex flex-col md:flex-row md:justify-between items-center mt-6 gap-4"
    >
      <div class="text-gray-600 text-sm">
        Página {{ pagina }} de {{ Math.ceil(total / tamanio) || 1 }}
      </div>
      <div class="flex gap-2">
        <button
          @click="cambiarPagina(pagina - 1)"
          :disabled="!prev || pagina === 1"
          class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
        >
          Anterior
        </button>
        <button
          @click="cambiarPagina(pagina + 1)"
          :disabled="!next || pagina === Math.ceil(total / tamanio)"
          class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
        >
          Siguiente
        </button>
      </div>
    </div>

    <!-- Modal crear/editar -->
    <transition name="fade">
      <div
        v-if="mostrarModal"
        class="fixed inset-0 z-50 flex items-center justify-center shadow-2xl bg-[rgba(0,0,0,0.5)]"
      >
        <div
          class="bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4 relative animate-fade-in"
        >
          <div class="flex items-center justify-between px-6 py-4 border-b">
            <h3 class="text-lg font-semibold text-gray-800">
              {{ modoEdicion ? "Editar Producto" : "Nuevo Producto" }}
            </h3>
            <button
              @click="cerrarModal"
              class="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              &times;
            </button>
          </div>
          <div class="p-6">
            <ProductoForm
              @saved="onSaved"
              :producto="productoAEditar"
              :modo-edicion="modoEdicion"
            />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

import ProductoServicio from "../services/ProductoServicio";
import ProductoForm from "../components/ProductoForm.vue";

const svc = new ProductoServicio();

export default {
  name: "ProductoPage",
  components: { ProductoForm },
  data() {
    return {
      busqueda: "",
      productos: [],
      total: 0,
      next: null,
      prev: null,
      pagina: 1,
      tamanio: 10,
      cargando: false,
      mostrarModal: false,
      productoAEditar: null,
      modoEdicion: false,
      timeoutBusqueda: null, // Para debounce
    };
  },
  created() {
    this.buscar(1);
  },
  methods: {
    // Búsqueda en tiempo real con debounce
    buscarEnTiempoReal() {
      // Limpiar timeout anterior si existe
      if (this.timeoutBusqueda) {
        clearTimeout(this.timeoutBusqueda);
      }

      // Establecer nuevo timeout
      this.timeoutBusqueda = setTimeout(() => {
        console.log("🔍 Búsqueda en tiempo real:", this.busqueda);
        this.buscar(1); // Resetear a página 1 en nueva búsqueda
      }, 300); // 300ms de delay
    },

    async buscar(page = 1) {
      this.cargando = true;

      try {
        console.log(
          "🔄 Cargando productos - Página:",
          page,
          "Búsqueda:",
          this.busqueda
        );

        const res = await svc.buscarProductos({
          buscar: this.busqueda.trim(),
          pagina: page,
          tamanio: this.tamanio,
        });

        console.log("📥 Respuesta recibida:", res);

        this.productos = res.results ?? [];
        this.total = res.count ?? this.productos.length;
        this.next = res.next;
        this.prev = res.previous;
        this.pagina = page;

        console.log("✅ Estado actualizado:", {
          productos: this.productos.length,
          total: this.total,
          pagina: this.pagina,
          next: !!this.next,
          prev: !!this.prev,
        });
      } catch (e) {
        console.error("❌ Error cargando productos:", e);
        this.productos = [];
        this.total = 0;
        this.next = null;
        this.prev = null;

        toast.error("Error al cargar productos", {
          autoClose: 2500,
        });
      } finally {
        this.cargando = false;
      }
    },

    // Cambiar página manteniendo la búsqueda actual
    cambiarPagina(page) {
      console.log("📄 Cambio de página:", this.pagina, "→", page);

      if (
        page < 1 ||
        (this.total > 0 && page > Math.ceil(this.total / this.tamanio))
      ) {
        console.warn("⚠️ Página fuera de rango:", page);
        return;
      }

      this.buscar(page);
    },

    limpiar() {
      console.log("🧹 Limpiando búsqueda");
      this.busqueda = "";

      // Limpiar timeout si existe
      if (this.timeoutBusqueda) {
        clearTimeout(this.timeoutBusqueda);
        this.timeoutBusqueda = null;
      }

      this.buscar(1);
    },

    abrirModal() {
      this.mostrarModal = true;
      this.productoAEditar = null;
      this.modoEdicion = false;
    },

    cerrarModal() {
      this.mostrarModal = false;
      this.productoAEditar = null;
      this.modoEdicion = false;
    },

    editarProducto(producto) {
      console.log("✏️ Editando producto:", producto.nombre);
      this.productoAEditar = { ...producto };
      this.modoEdicion = true;
      this.mostrarModal = true;
    },

    onSaved() {
      // Al guardar desde el formulario, refrescar y cerrar
      this.cerrarModal();
      this.buscar(this.pagina); // Mantener página actual
      const mensaje = this.modoEdicion
        ? "Producto actualizado ✅"
        : "Producto creado ✅";
      toast.success(mensaje, { autoClose: 1800 });
    },
  },

  // Limpiar timeout al destruir el componente
  beforeUnmount() {
    if (this.timeoutBusqueda) {
      clearTimeout(this.timeoutBusqueda);
    }
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
