<template>
  <div class="max-w-5xl mx-auto">
    <div class="bg-white rounded-lg p-6 space-y-6">
      <h3 class="text-xl font-semibold text-gray-800">
        Acta de Recepción Técnica
      </h3>

      <!-- Cabecera / selección de Acta -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Acta *</label>
          <select
            v-model.number="form.acta_id"
            class="input"
            :disabled="cargando.actas"
            required
          >
            <option :value="null" disabled>
              {{ cargando.actas ? "Cargando actas..." : "Seleccione un acta" }}
            </option>
            <option v-for="a in opcionesActas" :key="a.id" :value="a.id">
              {{ a.no_acta }} — {{ a.fecha_acta }}
            </option>
          </select>
          <p v-if="errores.acta_id" class="text-xs text-red-600 mt-1">
            {{ errores.acta_id }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Fecha de Entrega *</label
          >
          <input
            v-model="form.fecha_entrega"
            type="date"
            class="input"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Fecha de Inspección *</label
          >
          <input
            v-model="form.fecha_inspeccion"
            type="date"
            class="input"
            required
          />
        </div>
      </section>

      <section>
        <label class="block text-sm font-medium text-gray-700"
          >Observación general</label
        >
        <textarea
          v-model.trim="form.observacion_recep"
          rows="2"
          class="input"
        ></textarea>
      </section>

      <!-- Detalle técnico -->
      <section class="space-y-3">
        <div class="flex items-center justify-between">
          <h4 class="font-semibold">Detalle técnico (productos)</h4>
          <button type="button" class="btn" @click="agregarFila">
            + Agregar ítem
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="th">Producto *</th>
                <th class="th"># Cajas</th>
                <th class="th">Cant. recibida *</th>
                <th class="th">Lote</th>
                <th class="th">Fecha venc.</th>
                <th class="th">Concentración</th>
                <th class="th">Marca disp.</th>
                <th class="th">Forma farma</th>
                <th class="th">Unidad</th>
                <th class="th">Cumple</th>
                <th class="th"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(it, idx) in items" :key="it._key">
                <td class="td">
                  <select
                    v-model.number="it.producto"
                    class="input"
                    :disabled="cargando.productos"
                    required
                  >
                    <option :value="null" disabled>
                      {{ cargando.productos ? "Cargando..." : "Seleccione" }}
                    </option>
                    <option
                      v-for="p in opcionesProductos"
                      :key="p.id"
                      :value="p.id"
                    >
                      {{ p.cod_interno }} — {{ p.nombre }}
                    </option>
                  </select>
                </td>
                <td class="td">
                  <input
                    v-model.number="it.no_cajas"
                    type="number"
                    min="0"
                    class="input"
                  />
                </td>
                <td class="td">
                  <input
                    v-model.number="it.cantidad_recibida"
                    type="number"
                    min="0"
                    class="input"
                    required
                  />
                </td>
                <td class="td">
                  <input v-model.trim="it.lote" type="text" class="input" />
                </td>
                <td class="td">
                  <input
                    v-model="it.fecha_vencimiento"
                    type="date"
                    class="input"
                  />
                </td>
                <td class="td">
                  <input
                    v-model.trim="it.concentracion"
                    type="text"
                    class="input"
                  />
                </td>
                <td class="td">
                  <input
                    v-model.trim="it.marca_dispositivo"
                    type="text"
                    class="input"
                  />
                </td>
                <td class="td">
                  <input
                    v-model.trim="it.forma_farma"
                    type="text"
                    class="input"
                  />
                </td>
                <td class="td">
                  <input
                    v-model.trim="it.unidad_medida"
                    type="text"
                    class="input"
                  />
                </td>
                <td class="td">
                  <select v-model="it.cumple" class="input">
                    <option :value="true">Sí</option>
                    <option :value="false">No</option>
                  </select>
                </td>
                <td class="td">
                  <button
                    type="button"
                    class="text-red-600 hover:underline"
                    @click="removerFila(idx)"
                  >
                    Quitar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p v-if="errores.detalles" class="text-xs text-red-600">
          {{ errores.detalles }}
        </p>

        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Observaciones técnicas (opcional)</label
          >
          <textarea
            v-model.trim="observacionTecnicaGlobal"
            rows="2"
            class="input"
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">
            Si se diligencia, se copiará como observación por ítem sin valor
            propio.
          </p>
        </div>
      </section>

      <div class="flex justify-end gap-2 pt-3 border-t">
        <button
          class="btn"
          type="button"
          @click="resetForm"
          :disabled="enviando"
        >
          Limpiar
        </button>
        <button
          class="btn-primary"
          type="button"
          @click="guardar"
          :disabled="enviando"
        >
          <span v-if="enviando">Guardando…</span>
          <span v-else>Guardar</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { ActaServicio } from "../services/ActaServicio";

// estado base
const servicio = new ActaServicio();

const form = reactive({
  acta_id: null, // FK requerida
  fecha_entrega: "", // YYYY-MM-DD
  fecha_inspeccion: "", // YYYY-MM-DD
  observacion_recep: "", // opcional
});

const items = ref([]); // filas de Acta_tecnica_detalle
const observacionTecnicaGlobal = ref("");

const cargando = reactive({ actas: false, productos: false });
const enviando = ref(false);
const errores = reactive({ acta_id: "", detalles: "" });

const opcionesActas = ref([]);
const opcionesProductos = ref([]);

function agregarFila() {
  items.value.push({
    _key: cryptoRandom(),
    producto: null, // FK obligatoria
    no_cajas: null,
    cantidad_recibida: null, // obligatoria >=0
    lote: "",
    fecha_vencimiento: "", // YYYY-MM-DD opcional
    concentracion: "",
    marca_dispositivo: "",
    forma_farma: "",
    unidad_medida: "",
    cumple: true,
    observacion_tecnica: "", // si vacío y hay global, se copiará global
  });
}

function removerFila(idx) {
  items.value.splice(idx, 1);
}

function resetForm() {
  form.acta_id = null;
  form.fecha_entrega = "";
  form.fecha_inspeccion = "";
  form.observacion_recep = "";
  items.value = [];
  observacionTecnicaGlobal.value = "";
}

function validar() {
  errores.acta_id = !form.acta_id ? "Seleccione un acta" : "";
  if (!items.value.length) {
    errores.detalles = "Debe agregar al menos un ítem técnico";
  } else if (
    items.value.some(
      (i) =>
        !i.producto || i.cantidad_recibida == null || i.cantidad_recibida < 0
    )
  ) {
    errores.detalles =
      "Cada ítem debe tener producto y cantidad_recibida válida (>=0)";
  } else {
    errores.detalles = "";
  }
  return !errores.acta_id && !errores.detalles;
}

async function cargarActas() {
  cargando.actas = true;
  try {
    const res = await servicio.listarActas();
    opcionesActas.value = Array.isArray(res?.results) ? res.results : res;
  } finally {
    cargando.actas = false;
  }
}

async function cargarProductos() {
  cargando.productos = true;
  try {
    const res = await servicio.listarProductos();
    // normalizar por si viene paginado
    const arr = Array.isArray(res?.results) ? res.results : res;
    opcionesProductos.value = arr.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      cod_interno: p.cod_interno,
    }));
  } finally {
    cargando.productos = false;
  }
}

async function guardar() {
  if (!validar()) {
    toast.warning("Revise los campos obligatorios", {
      position: "bottom-right",
    });
    return;
  }
  enviando.value = true;
  try {
    // payload para Acta_recepcion_general
    const cabecera = {
      acta_id: form.acta_id,
      fecha_entrega: form.fecha_entrega,
      fecha_inspeccion: form.fecha_inspeccion,
      observacion_recep: form.observacion_recep || "",
    };

    // payload para detalles: se complementa con acta_recepcion_general_id luego de crear cabecera
    const detalles = items.value.map((i) => ({
      acta_id: form.acta_id,
      producto: i.producto,
      no_cajas: i.no_cajas ?? null,
      cantidad_recibida: i.cantidad_recibida,
      lote: i.lote || "",
      fecha_vencimiento: i.fecha_vencimiento || null,
      concentracion: i.concentracion || "",
      marca_dispositivo: i.marca_dispositivo || "",
      forma_farma: i.forma_farma || "",
      unidad_medida: i.unidad_medida || "",
      cumple: !!i.cumple,
      observacion_tecnica:
        i.observacion_tecnica || observacionTecnicaGlobal.value || "",
    }));

    await servicio.crearRecepcionConDetalles(cabecera, detalles);
    toast.success("Acta de recepción técnica registrada", {
      position: "bottom-right",
    });
    resetForm();
  } catch (e) {
    console.error(e);
    toast.error(parseError(e), { position: "bottom-right" });
  } finally {
    enviando.value = false;
  }
}

function parseError(e) {
  const d = e?.response?.data;
  if (!d) return "Error inesperado";
  if (typeof d === "string") return d;
  return Object.entries(d)
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
    .join(" | ");
}

function cryptoRandom() {
  // generador ligero para keys locales
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

onMounted(async () => {
  agregarFila(); // primera fila por defecto
  await Promise.all([cargarActas(), cargarProductos()]);
});
</script>
