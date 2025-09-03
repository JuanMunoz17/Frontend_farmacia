<template>
<div class="max-w-6xl mx-auto">
    <div class="bg-white rounded-lg shadow-lg p-6">
    <div class="border-b border-gray-200 pb-4 mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Registro Automático de Facturas</h2>
        <p class="mt-2 text-sm text-gray-600">
        Carga archivos XML para procesar automáticamente las facturas
        </p>
    </div>

    <!-- Componente de carga de archivos XML -->
    <UploadArchivo v-model="archivosXml" :max-files="8" />

    <!-- Botones de acción -->
    <div v-if="archivosXml.length > 0" class="mt-6 flex justify-end space-x-4">
        <button
        type="button"
        @click="procesarArchivos"
        :disabled="procesando"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
        <span v-if="procesando">Procesando...</span>
        <span v-else>Procesar Archivos XML</span>
        </button>
    </div>

    <!-- Resultados del procesamiento -->
    <div v-if="resultados.length > 0" class="mt-8">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Resultados del Procesamiento</h3>
        
        <div class="space-y-4">
        <div 
            v-for="(resultado, index) in resultados" 
            :key="index"
            class="border rounded-lg p-4"
            :class="{
            'border-green-200 bg-green-50': resultado.exito,
            'border-red-200 bg-red-50': !resultado.exito
            }"
        >
            <div class="flex items-start justify-between">
            <div>
                <h4 class="font-medium" :class="resultado.exito ? 'text-green-800' : 'text-red-800'">
                {{ resultado.archivo }}
                </h4>
                <p class="text-sm mt-1" :class="resultado.exito ? 'text-green-600' : 'text-red-600'">
                {{ resultado.mensaje }}
                </p>
            </div>
            <div class="flex-shrink-0">
                <svg 
                v-if="resultado.exito" 
                class="h-6 w-6 text-green-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <svg 
                v-else 
                class="h-6 w-6 text-red-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </div>
            </div>
        </div>
        </div>
    </div>
    </div>
</div>
</template>

<script setup>
import { ref } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import UploadArchivo from '../components/UploadArchivo.vue'

const archivosXml = ref([])
const procesando = ref(false)
const resultados = ref([])

const procesarArchivos = async () => {
if (archivosXml.value.length === 0) {
    toast.warning('No hay archivos para procesar')
    return
}

procesando.value = true
resultados.value = []

try {
    // Aquí iría la lógica para procesar cada archivo XML
    for (const archivo of archivosXml.value) {
    try {
        // Simular procesamiento del archivo
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Aquí llamarías a tu servicio para procesar el XML
        // const resultado = await facturaServicio.procesarXML(archivo)
        
        resultados.value.push({
        archivo: archivo.name,
        exito: true,
        mensaje: 'Factura procesada correctamente'
        })
        
        toast.success(`✅ ${archivo.name} procesado correctamente`)
    } catch (error) {
        resultados.value.push({
        archivo: archivo.name,
        exito: false,
        mensaje: error.message || 'Error al procesar el archivo'
        })
        
        toast.error(`❌ Error procesando ${archivo.name}`)
    }
    }
} catch (error) {
    toast.error('Error general al procesar archivos')
} finally {
    procesando.value = false
}
}
</script>