<!-- src/components/ProductoForm.vue (ajustado para modal y payload correcto) -->
<template>
  <div class="max-w-4xl mx-auto">
    <div class="bg-white rounded-lg">
      <form @submit.prevent="guardar" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Código Interno *</label
            >
            <input
              v-model.trim="producto.cod_interno"
              type="text"
              required
              maxlength="30"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Nombre *</label
            >
            <input
              v-model.trim="producto.nombre"
              type="text"
              required
              maxlength="30"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Presentación *</label
            >
            <input
              v-model.trim="producto.presentacion"
              type="text"
              required
              maxlength="30"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Marca *</label
            >
            <input
              v-model.trim="producto.marca"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Fábrica *</label
            >
            <input
              v-model.trim="producto.fabrica"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Registro INVIMA</label
            >
            <input
              v-model.trim="producto.registro_invima"
              type="text"
              maxlength="60"
              :pattern="patronInvima"
              title="Solo letras y números"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p class="text-xs text-gray-500 mt-1">
              Coincide con la validación del backend.
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >CUM</label
            >
            <input
              v-model.trim="producto.cum"
              type="text"
              maxlength="30"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >ATC</label
            >
            <input
              v-model.trim="producto.atc"
              type="text"
              maxlength="30"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Fecha de Vencimiento</label
            >
            <input
              v-model="producto.fecha_vencimiento"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Estado</label
            >
            <select
              v-model="producto.estado"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option :value="true">Activo</option>
              <option :value="false">Inactivo</option>
            </select>
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Observación de Precio *</label
            >
            <textarea
              v-model.trim="producto.observacion_precio"
              rows="2"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            @click="resetForm"
            class="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Limpiar
          </button>
          <button
            type="submit"
            class="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {{ editId ? "Actualizar" : "Guardar" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import ProductoServicio from "../services/ProductoServicio";

const svc = new ProductoServicio();

export default {
  name: "ProductoForm",
  emits: ["saved"],
  props: {
    editId: { type: [Number, String], default: null },
  },
  data() {
    return {
      // El backend prohibe caracteres especiales (ver serializer)
      patronInvima: "^[A-Za-z0-9\\s]*$",
      producto: {
        cod_interno: "",
        nombre: "",
        presentacion: "",
        marca: "",
        fabrica: "",
        registro_invima: "",
        cum: "",
        atc: "",
        estado: true,
        fecha_vencimiento: "",
        observacion_precio: "",
      },
    };
  },
  async created() {
    if (this.editId) {
      try {
        const p = await svc.obtenerProducto(this.editId);
        this.producto = {
          cod_interno: p.cod_interno ?? "",
          nombre: p.nombre ?? "",
          presentacion: p.presentacion ?? "",
          marca: p.marca ?? "",
          fabrica: p.fabrica ?? "",
          registro_invima: p.registro_invima ?? "",
          cum: p.cum ?? "",
          atc: p.atc ?? "",
          estado: p.estado ?? true,
          fecha_vencimiento: p.fecha_vencimiento ?? "",
          observacion_precio: p.observacion_precio ?? "",
        };
      } catch (e) {
        toast.error("Error cargando producto", { autoClose: 3000 });
      }
    }
  },
  methods: {
    async guardar() {
      const oblig = [
        "cod_interno",
        "nombre",
        "presentacion",
        "marca",
        "fabrica",
        "observacion_precio",
      ];
      if (oblig.some((k) => !String(this.producto[k] || "").trim())) {
        toast.warning("Completa los campos obligatorios", { autoClose: 2200 });
        return;
      }

      const loading = toast.loading(
        this.editId ? "Actualizando..." : "Guardando..."
      );
      try {
        if (this.editId) {
          await svc.editarProducto(this.editId, this.producto, true);
        } else {
          await svc.crearProducto(this.producto);
        }
        toast.update(loading, {
          render: "Producto guardado ✅",
          type: "success",
          isLoading: false,
          autoClose: 1800,
        });
        this.$emit("saved");
        if (!this.editId) this.resetForm();
      } catch (error) {
        const msg = error?.data?.detail || "No fue posible guardar";
        toast.update(loading, {
          render: `Error: ${msg}`,
          type: "error",
          isLoading: false,
          autoClose: 3200,
        });
      }
    },
    resetForm() {
      this.producto = {
        cod_interno: "",
        nombre: "",
        presentacion: "",
        marca: "",
        fabrica: "",
        registro_invima: "",
        cum: "",
        atc: "",
        estado: true,
        fecha_vencimiento: "",
        observacion_precio: "",
      };
      toast.info("Formulario reiniciado", { autoClose: 1500 });
    },
  },
};
</script>
