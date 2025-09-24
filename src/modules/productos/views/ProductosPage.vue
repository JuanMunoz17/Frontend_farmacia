<!-- src/modules/productos/views/ProductosPage.vue -->
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

    <!-- Barra de búsqueda igual a ProveedoresPage -->
    <div
      class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4"
    >
      <div class="flex-1">
        <input
          v-model="busqueda"
          @keyup.enter="buscarProductos"
          @input="buscarEnTiempoReal"
          type="text"
          placeholder="Buscar por nombre, código, presentación o marca..."
          class="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
        />
      </div>
      <div class="flex-1 text-right text-gray-500 text-sm mt-2 md:mt-0">
        Mostrando {{ productos.length }} de {{ total }} productos
        <span v-if="cargando" class="text-blue-600 ml-2">
          <svg
            class="inline animate-spin h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
          >
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
        </span>
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
          <tr v-for="p in productos" :key="p.id">
            <td class="px-6 py-4 whitespace-nowrap">
              {{ p.cod_interno || p.codigo || "-" }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">{{ p.nombre || "-" }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ p.presentacion || "-" }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">{{ p.marca || "-" }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ p.fabrica || p.fabricante || "-" }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="
                  p.estado || p.activo
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                "
                class="px-2 py-1 rounded text-xs font-medium"
              >
                {{ p.estado || p.activo ? "Activo" : "Inactivo" }}
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
          <tr v-if="productos.length === 0">
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

    <!-- Paginación SIEMPRE habilitada -->
    <div
      class="flex flex-col md:flex-row md:justify-between items-center mt-6 gap-4"
    >
      <div class="text-gray-600 text-sm">
        <span v-if="total > 0">
          Página {{ pagina }} de {{ totalPaginas }} ({{ total }} productos total)
        </span>
        <span v-else>
          Sin resultados
        </span>
      </div>
      <div class="flex gap-2">
        <button
          @click="irPaginaAnterior"
          :disabled="cargando"
          class="px-4 py-2 rounded-lg font-semibold transition duration-200"
          :class="{
            'bg-blue-600 text-white hover:bg-blue-700': !cargando,
            'bg-gray-300 text-gray-500 cursor-not-allowed': cargando
          }"
        >
          <span v-if="cargando">
            <svg class="inline animate-spin h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          Anterior
        </button>
        <button
          @click="irPaginaSiguiente"
          :disabled="cargando"
          class="px-4 py-2 rounded-lg font-semibold transition duration-200"
          :class="{
            'bg-blue-600 text-white hover:bg-blue-700': !cargando,
            'bg-gray-300 text-gray-500 cursor-not-allowed': cargando
          }"
        >
          <span v-if="cargando">
            <svg class="inline animate-spin h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          Siguiente
        </button>
      </div>
    </div>

    <!-- Modal crear/editar -->
    <div
      v-if="mostrarModal"
      class="fixed inset-0 z-50 flex items-center justify-center shadow-2xl bg-[rgba(0,0,0,0.5)]"
    >
      <div
        class="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative animate-fade-in"
      >
        <button
          @click="cerrarModal"
          class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold"
        >
          &times;
        </button>
        <ProductoForm
          @close="cerrarModal"
          @saved="onSaved"
          :producto="productoAEditar"
          :modo-edicion="modoEdicion"
        />
      </div>
    </div>
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
  computed: {
    totalPaginas() {
      return Math.ceil(this.total / this.tamanio) || 1;
    },
  },
  created() {
    this.cargarProductos();
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
        this.buscarProductos(); // Llamar a buscarProductos en lugar de buscar
      }, 300); // 300ms de delay
    },

    // Función de búsqueda unificada
    buscarProductos() {
      console.log("🔍 Iniciando búsqueda de productos");
      this.pagina = 1; // Reset a página 1 en nueva búsqueda
      this.cargarProductos();
    },

    async cargarProductos() {
      this.cargando = true;

      try {
        console.log(
          "🔄 Cargando productos - Página:",
          this.pagina,
          "Búsqueda:",
          this.busqueda
        );

        const params = {
          buscar: this.busqueda.trim(),
          pagina: this.pagina,
          tamanio: this.tamanio,
        };

        console.log("📤 Parámetros enviados:", params);

        const res = await svc.buscarProductos(params);

        console.log("📥 Respuesta recibida:", res);

        this.productos = res.results ?? [];
        this.total = res.count ?? this.productos.length;
        this.next = res.next;
        this.prev = res.previous;

        console.log("✅ Estado actualizado:", {
          productos: this.productos.length,
          total: this.total,
          pagina: this.pagina,
          totalPaginas: this.totalPaginas,
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

    // ========== NAVEGACIÓN SIEMPRE HABILITADA ==========
    
    /**
     * Ir a página anterior - SIEMPRE habilitado
     */
    irPaginaAnterior() {
      if (this.cargando) return;
      
      console.log("⬅️ Navegando hacia atrás desde página:", this.pagina);
      
      if (this.pagina > 1) {
        // Si estamos en página > 1, ir a la anterior
        this.pagina--;
        console.log("📄 Yendo a página:", this.pagina);
      } else {
        // Si estamos en página 1, ir a la última página
        const ultimaPagina = this.totalPaginas;
        this.pagina = ultimaPagina;
        console.log("🔄 Volviendo a la última página:", this.pagina);
        
        toast.info(`Navegando a la última página (${ultimaPagina})`, {
          position: "bottom-right",
          autoClose: 1500
        });
      }
      
      this.cargarProductos();
    },

    /**
     * Ir a página siguiente - SIEMPRE habilitado
     */
    irPaginaSiguiente() {
      if (this.cargando) return;
      
      console.log("➡️ Navegando hacia adelante desde página:", this.pagina);
      
      if (this.pagina < this.totalPaginas) {
        // Si hay páginas siguientes, ir a la siguiente
        this.pagina++;
        console.log("📄 Yendo a página:", this.pagina);
      } else {
        // Si estamos en la última página, volver a la primera
        this.pagina = 1;
        console.log("🔄 Volviendo a la primera página");
        
        toast.info("Navegando a la primera página", {
          position: "bottom-right",
          autoClose: 1500
        });
      }
      
      this.cargarProductos();
    },

    // ========== NAVEGACIÓN TRADICIONAL (mantener por compatibilidad) ==========
    
    /**
     * Cambiar página manteniendo la búsqueda actual - MÉTODO ORIGINAL
     */
    cambiarPagina(nuevaPagina) {
      console.log("📄 Cambio de página tradicional:", this.pagina, "→", nuevaPagina);

      if (nuevaPagina < 1 || nuevaPagina > this.totalPaginas) {
        console.warn("⚠️ Página fuera de rango:", nuevaPagina);
        return;
      }

      this.pagina = nuevaPagina;
      this.cargarProductos();
    },

    // ========== OTRAS FUNCIONES ==========

    limpiar() {
      console.log("🧹 Limpiando búsqueda");
      this.busqueda = "";

      // Limpiar timeout si existe
      if (this.timeoutBusqueda) {
        clearTimeout(this.timeoutBusqueda);
        this.timeoutBusqueda = null;
      }

      this.buscarProductos();
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
      this.cargarProductos(); // Mantener página actual
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
