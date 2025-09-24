<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
    <div>
      <label class="block text-sm font-semibold text-gray-800 mb-2">
        Órdenes Relacionadas
      </label>
      <div
        class="flex flex-col gap-2 max-h-56 overflow-y-auto border border-blue-200 shadow-md rounded-xl p-4 bg-gradient-to-b from-blue-50 to-white transition hover:shadow-lg"
      >
        <div
          v-for="orden in ordenes"
          :key="orden.id"
          class="flex items-center hover:bg-blue-100 rounded px-2 py-1"
        >
          <input
            type="checkbox"
            :id="'orden-' + orden.id"
            :value="orden.id"
            v-model="localOrdenes"
            class="mr-2 accent-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label
            :for="'orden-' + orden.id"
            class="text-sm text-gray-700 font-medium"
          >
            <span class="inline-block mr-1 text-blue-500">📦</span
            >{{ orden.no_orden }}
          </label>
        </div>
      </div>
    </div>
    <div>
      <label class="block text-sm font-semibold text-gray-800 mb-2">
        Facturas Relacionadas
      </label>
      <div
        class="flex flex-col gap-2 max-h-56 overflow-y-auto border border-green-200 shadow-md rounded-xl p-4 bg-gradient-to-b from-green-50 to-white transition hover:shadow-lg"
      >
        <div
          v-for="factura in facturas"
          :key="factura.id"
          class="flex items-center hover:bg-green-100 rounded px-2 py-1"
        >
          <input
            type="checkbox"
            :id="'factura-' + factura.id"
            :value="factura.id"
            v-model="localFacturas"
            class="mr-2 accent-green-600 rounded border-gray-300 focus:ring-green-500"
          />
          <label
            :for="'factura-' + factura.id"
            class="text-sm text-gray-700 font-medium"
          >
            <span class="inline-block mr-1 text-green-500">🧾</span
            >{{ factura.no_factura }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ActaOrdenServicio,
  ActaFacturaServicio,
} from "../services/ActasServicio";
import { ref, watch, onMounted } from "vue";
import { OrdenPedidoServicio } from "../../orden-pedido/services/OrdenPedidoServicio";
import { FacturaServicio } from "../../factura/services/FacturaServicio";

const props = defineProps({
  ordenesSeleccionadas: { type: Array, default: () => [] },
  facturasSeleccionadas: { type: Array, default: () => [] },
});

const emit = defineEmits([
  "update:ordenesSeleccionadas",
  "update:facturasSeleccionadas",
]);

const localOrdenes = ref([...props.ordenesSeleccionadas]);
const localFacturas = ref([...props.facturasSeleccionadas]);

watch(localOrdenes, (val) => emit("update:ordenesSeleccionadas", val));
watch(localFacturas, (val) => emit("update:facturasSeleccionadas", val));

const cargarOrdenes = async () => {
  try {
    const res = await ordenSrv.buscarOrdenes({ pagina: 1, tamanio: 50 });
    ordenes.value = Array.isArray(res.results) ? res.results : [];
  } catch (e) {
    ordenes.value = [];
  }
};

const cargarFacturas = async () => {
  try {
    const res = await facturaSrv.buscarFacturas({ pagina: 1, tamanio: 50 });
    facturas.value = Array.isArray(res.results) ? res.results : [];
  } catch (e) {
    facturas.value = [];
  }
};

const guardarRelaciones = async (actaId) => {
  try {
    //guardar ordenes de las realciones
    if (localOrdenes.value.length > 0) {
      const actaOrdenSrv = new ActaOrdenServicio();
      await actaOrdenSrv.vincularOrdenes(actaId, localOrdenes.value);
    }

    //guardar facturas de las relaciones
    if (localOrdenes.value.length > 0) {
      const actaFacturaSrv = new ActaFacturaServicio();
      await actaFacturaSrv.vincularFacturas(actaId, localFacturas.value);
    }
    return true;
  } catch (error) {
    return false;
  }
};
/*
const guardarRelaciones = async (actaId) => {
    try {
        // Guardar órdenes relacionadas
        if (localOrdenes.value.length > 0) {
            const actaOrdenSrv = new ActaOrdenServicio();
            await actaOrdenSrv.vincularOrdenes(actaId, localOrdenes.value);
        }
        // Guardar facturas relacionadas
        if (localFacturas.value.length > 0) {
            const actaFacturaSrv = new ActaFacturaServicio();
            await actaFacturaSrv.vincularFacturas(actaId, localFacturas.value);
        }
        return true;
    } catch (error) {
        return false;
    }
};
*/

const ordenSrv = new OrdenPedidoServicio();
const facturaSrv = new FacturaServicio();

const ordenes = ref([]);
const facturas = ref([]);

onMounted(() => {
  cargarOrdenes();
  cargarFacturas();
});
</script>
