<template>
  <div class="max-w-6xl mx-auto">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h3 class="text-xl font-bold text-gray-800 mb-6">Acta de Recepción</h3>
      <form @submit.prevent="guardarActa" class="space-y-6">
        <div>
          <h4 class="text-lg font-medium text-gray-800 mb-4">
            Información General
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- NUEVO: Selector de acta por no_acta -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Número de Acta *</label
              >
              <select
                v-model="actaSeleccionada"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" disabled>Seleccione un número de acta</option>
                <option
                  v-for="a in actasCabecera"
                  :key="a.id"
                  :value="a.no_acta"
                >
                  {{ a.no_acta }} - {{ a.persona_recepcion }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Fecha de Entrega *</label
              >
              <input
                v-model="acta.fecha_entrega"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Fecha de Inspección</label
              >
              <input
                v-model="acta.fecha_inspeccion"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div class="md:col-span-3">
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Observación Recepción</label
              >
              <input
                v-model.trim="acta.observacion_recepcion"
                type="text"
                maxlength="255"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Opcional"
              />
            </div>
          </div>
        </div>

        <div class="border-t pt-6">
          <div class="flex justify-between items-center mb-4">
            <h4 class="text-lg font-medium text-gray-800">Detalles del Acta</h4>
            <button
              type="button"
              @click="agregarDetalle"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Agregar Producto
            </button>
          </div>

          <div
            v-for="(det, index) in acta.detalles"
            :key="index"
            class="bg-gray-50 rounded-lg p-4 mb-4"
          >
            <div
              class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            >
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Producto</label
                >
                <select
                  v-model.number="det.producto"
                  required
                  class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option :value="null" disabled>Seleccione producto</option>
                  <option
                    v-for="prod in productosOpts"
                    :key="prod.id"
                    :value="prod.id"
                  >
                    {{ prod.nombre }} ({{ prod.cod_interno }})
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >No. Cajas</label
                >
                <input
                  v-model.number="det.no_cajas"
                  type="number"
                  min="0"
                  class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="Cantidad de cajas"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Cantidad Recibida</label
                >
                <input
                  v-model.number="det.cantidad_recibida"
                  type="number"
                  min="0"
                  class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="Cantidad recibida"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Lote</label
                >
                <input
                  v-model.trim="det.lote"
                  type="text"
                  class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="Lote"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Fecha Vencimiento</label
                >
                <input
                  v-model="det.fecha_vencimiento"
                  type="date"
                  class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Concentración</label
                >
                <input
                  v-model.trim="det.concentracion"
                  type="text"
                  class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="Concentración"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Marca Dispositivo</label
                >
                <input
                  v-model.trim="det.marca_dispositivo"
                  type="text"
                  class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="Marca"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Forma Farmacia</label
                >
                <input
                  v-model.trim="det.forma_farmacia"
                  type="text"
                  class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="Forma farmacia"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Unidad Medida</label
                >
                <input
                  v-model.trim="det.unidad_medida"
                  type="text"
                  class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="Unidad"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Cumple</label
                >
                <select
                  v-model="det.cumple"
                  class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option :value="true">Sí</option>
                  <option :value="false">No</option>
                </select>
              </div>
              <div class="col-span-full">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Observación Técnica</label
                >
                <textarea
                  v-model.trim="det.observacion_tecnica"
                  rows="2"
                  class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="Observación técnica"
                ></textarea>
              </div>
              <div class="flex items-end col-span-full">
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
            <span v-else>Guardar Acta</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import ActaRecepcionServicio from "../services/ActaRecepcionServicio";
import ProductoServicio from "../../productos/services/ProductoServicio";
import { ActaServicio } from "../../acta/services/ActasServicio";

const actaSrv = new ActaRecepcionServicio();
const productoSrv = new ProductoServicio();
const actaCabeceraSrv = new ActaServicio();

const acta = ref({
  acta_id: "",
  fecha_entrega: "",
  fecha_inspeccion: "",
  observacion_recepcion: "",
  detalles: [],
});

const productosOpts = ref([]);
const cargando = ref(false);

// NUEVO: lista de actas cabecera
const actasCabecera = ref([]);
const actaSeleccionada = ref(""); // no_acta seleccionado

const cargarProductos = async () => {
  try {
    const res = await productoSrv.buscarProductos({ pagina: 1, tamanio: 100 });
    productosOpts.value = Array.isArray(res.results) ? res.results : [];
  } catch (e) {
    toast.error("Error cargando productos", { autoClose: 2500 });
    productosOpts.value = [];
  }
};

// NUEVO: cargar todas las actas cabecera
const cargarActasCabecera = async () => {
  try {
    const res = await actaCabeceraSrv.buscarActas({ pagina: 1, tamanio: 100 });
    actasCabecera.value = Array.isArray(res.results) ? res.results : [];
  } catch (e) {
    toast.error("Error cargando actas", { autoClose: 2500 });
    actasCabecera.value = [];
  }
};

const agregarDetalle = () => {
  acta.value.detalles.push({
    producto: null,
    no_cajas: 0,
    cantidad_recibida: 0,
    lote: "",
    fecha_vencimiento: "",
    concentracion: "",
    marca_dispositivo: "",
    forma_farmacia: "",
    unidad_medida: "",
    cumple: true,
    observacion_tecnica: "",
  });
};

const eliminarDetalle = (index) => {
  acta.value.detalles.splice(index, 1);
  if (acta.value.detalles.length === 0) {
    agregarDetalle();
  }
};

const resetForm = () => {
  acta.value = {
    acta_id: "",
    fecha_entrega: "",
    fecha_inspeccion: "",
    observacion_recepcion: "",
    detalles: [],
  };
  actaSeleccionada.value = "";
  agregarDetalle();
  toast.info("Formulario reiniciado", { autoClose: 2000 });
};

const guardarActa = async () => {
  if (!actaSeleccionada.value) {
    toast.warning("Debes seleccionar un número de acta", { autoClose: 2500 });
    return;
  }
  if (!acta.value.fecha_entrega) {
    toast.warning("Fecha de entrega es obligatoria", { autoClose: 2500 });
    return;
  }
  if (!acta.value.detalles.every((d) => d.producto != null)) {
    toast.warning("Cada detalle debe tener producto", { autoClose: 2500 });
    return;
  }

  // Buscar el acta por no_acta y asignar el id correspondiente
  const actaEncontrada = actasCabecera.value.find(
    (a) => a.no_acta === actaSeleccionada.value
  );
  if (!actaEncontrada) {
    toast.error("No se encontró el acta seleccionada", { autoClose: 2500 });
    return;
  }
  acta.value.acta_id = actaEncontrada.id;

  const payload = {
    acta_id: acta.value.acta_id != null ? Number(acta.value.acta_id) : null,
    fecha_entrega: acta.value.fecha_entrega,
    fecha_inspeccion: acta.value.fecha_inspeccion,
    observacion_recep: acta.value.observacion_recepcion,
    detalles_tecnicos: acta.value.detalles.map((d) => ({
      producto: Number(d.producto),
      no_cajas: Number(d.no_cajas ?? 0),
      cantidad_recibida: Number(d.cantidad_recibida ?? 0),
      lote: (d.lote ?? "").toString().trim(),
      fecha_vencimiento: d.fecha_vencimiento || null,
      concentracion: (d.concentracion ?? "").toString().trim(),
      marca_dispositivo: (d.marca_dispositivo ?? "").toString().trim(),
      forma_farma: (d.forma_farmacia ?? "").toString().trim(),
      unidad_medida: (d.unidad_medida ?? "").toString().trim(),
      cumple: Boolean(d.cumple ?? true),
      observacion_tecnica: (d.observacion_tecnica ?? "").toString().trim(),
    })),
  };

  const loadingId = toast.loading("Guardando acta...");
  cargando.value = true;
  try {
    await actaSrv.crearActaRecepcion(payload);
    toast.update(loadingId, {
      render: "Acta creada con éxito ✅",
      type: "success",
      isLoading: false,
      autoClose: 2500,
    });
    resetForm();
  } catch (error) {
    const msg =
      error?.data?.detail ||
      error?.data?.non_field_errors?.[0] ||
      "No fue posible crear el acta";
    toast.update(loadingId, {
      render: `Error: ${msg}`,
      type: "error",
      isLoading: false,
      autoClose: 3500,
    });
  } finally {
    cargando.value = false;
  }
};

onMounted(() => {
  cargarProductos();
  cargarActasCabecera();
  agregarDetalle();
});
</script>
