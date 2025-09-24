<template>
  <div class="max-w-4xl mx-auto">
    <div class="bg-white rounded-lg p-6">
      <h3 class="text-xl font-semibold text-gray-800 mb-6">
        {{ modoEdicion ? "Editar Proveedor" : "Registro de Proveedores" }}
      </h3>
      <form @submit.prevent="guardarProveedor" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Tipo Documento</label
            >
            <select
              v-model="form.tipo_documento"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
            >
              <option value="">Seleccione</option>
              <option value="1">CC</option>
              <option value="2">NIT</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >No. Documento</label
            >
            <input
              v-model="form.no_documento"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Nombre</label
            >
            <input
              v-model="form.nombre"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Teléfono</label
            >
            <input
              v-model="form.telefono"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
            />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700"
              >Correo</label
            >
            <input
              v-model="form.correo"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
            />
          </div>
        </div>
        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="isLoading"
            class="px-6 py-2 rounded-lg text-white font-semibold transition duration-200"
            :class="{
              'bg-blue-500 hover:bg-blue-600': !isLoading,
              'bg-gray-400 cursor-not-allowed': isLoading,
            }"
          >
            <span v-if="isLoading">Guardando...</span>
            <span v-else>{{
              modoEdicion ? "Actualizar Proveedor" : "Guardar Proveedor"
            }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { toast } from "vue3-toastify";
import { ProveedoresServicio } from "@proveedores/services/ProveedoresServicio.js";

export default {
  name: "ProveedoresForm",
  props: {
    proveedor: { type: Object, default: () => ({}) },
    modoEdicion: { type: Boolean, default: false },
    editId: { type: [Number, String], default: null },
  },
  emits: ["saved", "close"],
  setup(props, { emit }) {
    const form = ref({
      tipo_documento: "",
      no_documento: "",
      nombre: "",
      telefono: "",
      correo: "",
    });

    const isLoading = ref(false);
    const proveedoresService = new ProveedoresServicio();

    // Si es edición, cargar datos del proveedor
    const cargarProveedor = async () => {
      if (props.modoEdicion && props.editId) {
        try {
          isLoading.value = true;
          const data = await proveedoresService.obtenerProveedor(props.editId);
          form.value = {
            tipo_documento: data.tipo_documento ?? "",
            no_documento: data.no_documento ?? "",
            nombre: data.nombre ?? "",
            telefono: data.telefono ?? "",
            correo: data.correo ?? "",
          };
        } catch (err) {
          toast.error("Error al cargar proveedor", {
            position: "bottom-right",
            autoClose: 3000,
          });
        } finally {
          isLoading.value = false;
        }
      } else if (
        props.modoEdicion &&
        props.proveedor &&
        Object.keys(props.proveedor).length > 0
      ) {
        form.value = {
          tipo_documento: props.proveedor.tipo_documento ?? "",
          no_documento: props.proveedor.no_documento ?? "",
          nombre: props.proveedor.nombre ?? "",
          telefono: props.proveedor.telefono ?? "",
          correo: props.proveedor.correo ?? "",
        };
      } else {
        resetForm();
      }
    };

    onMounted(cargarProveedor);
    watch(() => props.editId, cargarProveedor);
    watch(() => props.proveedor, cargarProveedor);

    const guardarProveedor = async () => {
      const proveedorPayload = {
        tipo_documento: form.value.tipo_documento,
        no_documento: form.value.no_documento,
        nombre: form.value.nombre,
        telefono: form.value.telefono,
        correo: form.value.correo,
      };
      try {
        isLoading.value = true;
        let result;
        if (props.modoEdicion && props.editId) {
          result = await proveedoresService.editarProveedor(
            props.editId,
            proveedorPayload,
            true
          );
        } else {
          result = await proveedoresService.crearProveedor(proveedorPayload);
        }
        toast.success(
          `Proveedor ${
            props.modoEdicion ? "actualizado" : "guardado"
          } exitosamente`,
          { position: "bottom-right", autoClose: 2000 }
        );
        emit("saved", result);
        resetForm();
      } catch (err) {
        console.error("Error al guardar proveedor:", err);
        const errorMessage =
          err.message || "Error al guardar el proveedor. Intente nuevamente.";
        toast.error(errorMessage, {
          position: "bottom-right",
          autoClose: 3000,
        });
      } finally {
        isLoading.value = false;
      }
    };

    const resetForm = () => {
      form.value.tipo_documento = "";
      form.value.no_documento = "";
      form.value.nombre = "";
      form.value.telefono = "";
      form.value.correo = "";
    };

    return {
      form,
      isLoading,
      guardarProveedor,
      resetForm,
    };
  },
};
</script>
