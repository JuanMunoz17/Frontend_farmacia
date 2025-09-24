<template>
  <div class="max-w-6xl mx-auto px-2">
    <div class="bg-white rounded-lg shadow-lg p-4 md:p-6">
      <!-- Título en negrilla -->
      <h3 class="text-xl font-bold text-gray-800 mb-6">Registro de Actas</h3>

      <form @submit.prevent="guardar" class="space-y-6">
        <!-- Información General del Acta -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Número de Acta *
            </label>
            <input
              v-model="form.no_acta"
              type="text"
              required
              maxlength="30"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Número del acta"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Persona quien realiza el Acta *
            </label>
            <input
              v-model="form.persona_recepcion"
              type="text"
              required
              maxlength="30"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nombre de quien recibe"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Fecha del Acta *
            </label>
            <input
              v-model="form.fecha_acta"
              type="date"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              OPC
            </label>
            <input
              v-model="form.opc"
              type="text"
              maxlength="60"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Información OPC"
            />
          </div>
        </div>

        <!-- Relaciones -->
        <div class="border-t pt-6">
          <h4 class="text-lg font-bold text-gray-800 mb-4">Relaciones</h4>
          <ActaRelacionesSelect
            ref="relacionesRef"
            v-model:ordenesSeleccionadas="form.ordenes"
            v-model:facturasSeleccionadas="form.facturas"
          />
        </div>
        <!-- Botones -->
        <div
          class="flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-4 pt-6 border-t"
        >
          <button
            type="button"
            @click="resetForm"
            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors w-full md:w-auto"
          >
            Limpiar
          </button>
          <button
            type="submit"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto"
          >
            Guardar Acta
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ActaRelacionesSelect from "./ActaRelacionesSelect.vue";
import { ActaServicio } from "../services/ActasServicio";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const form = ref({
  no_acta: "",
  persona_recepcion: "",
  opc: "",
  fecha_acta: "",
  ordenes: [], // IDs seleccionados de órdenes
  facturas: [], // IDs seleccionados de facturas
});

const actaSrv = new ActaServicio();
const relacionesRef = ref(null);
const guardando = ref(false);

const guardar = async () => {
  guardando.value = true;
  try {
    // Usar el método crearActaFull para guardar acta y relaciones
    const payload = {
      no_acta: form.value.no_acta,
      persona_recepcion: form.value.persona_recepcion,
      opc: form.value.opc,
      fecha_acta: form.value.fecha_acta,
      ordenes: form.value.ordenes,
      facturas: form.value.facturas,
    };
    const respuesta = await actaSrv.crearActaFull(payload);
    toast.success("Acta y relaciones guardadas correctamente");
    // Opcional: limpiar formulario
    form.value = {
      no_acta: "",
      persona_recepcion: "",
      opc: "",
      fecha_acta: "",
      ordenes: [],
      facturas: [],
    };
  } catch (error) {
    let msg = "No fue posible guardar el acta";
    if (error?.response?.data) {
      if (typeof error.response.data === "string") {
        msg = error.response.data;
      } else if (error.response.data.detail) {
        msg = error.response.data.detail;
      } else if (error.response.data.non_field_errors) {
        msg = error.response.data.non_field_errors.join(", ");
      } else {
        msg = Object.entries(error.response.data)
          .map(
            ([field, err]) =>
              `${field}: ${Array.isArray(err) ? err.join(", ") : err}`
          )
          .join(" | ");
      }
    } else if (error?.message) {
      msg = error.message;
    }
    toast.error(`Error: ${msg}`, { autoClose: 5000 });
    console.error("Error al guardar acta y relaciones:", error);
  } finally {
    guardando.value = false;
  }
};

const resetForm = () => {
  form.value = {
    no_acta: "",
    persona_recepcion: "",
    opc: "",
    fecha_acta: "",
    ordenes: [],
    facturas: [],
  };
};
</script>
