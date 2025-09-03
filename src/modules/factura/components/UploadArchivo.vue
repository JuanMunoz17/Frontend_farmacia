<template>
  <div class="border-t pt-6">
    <h4 class="text-lg font-medium text-gray-800 mb-4">Archivos XML de facturas</h4>

    <div class="relative">
      <input
        ref="fileInput"
        type="file"
        accept=".xml,application/xml,text/xml"
        multiple
        class="hidden"
        @change="onFileChange"
      />

      <div class="group">
        <div
          @click="triggerBrowse"
          @dragover.prevent="dragging = true"
          @dragleave.prevent="dragging = false"
          @drop.prevent="handleDrop"
          :class="[
            'w-full border-2 border-dashed rounded-xl p-8 text-center transition',
            dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50',
            uploadedFiles.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          ]"
          role="button"
          tabindex="0"
          @keydown.enter.prevent="triggerBrowse"
          @keydown.space.prevent="triggerBrowse"
        >
          <div class="flex flex-col items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M3 15a4 4 0 014-4h1m0 0a4 4 0 118 0h1a4 4 0 014 4v2a3 3 0 01-3 3H6a3 3 0 01-3-3v-2z" />
            </svg>
            <p class="text-sm text-gray-700">
              <span v-if="uploadedFiles.length < maxFiles">
                Arrastra y suelta tus archivos <span class="font-medium">.xml</span> aquí
                o <span class="text-blue-600 font-medium underline">haz clic para buscar</span>
              </span>
              <span v-else class="text-gray-500">
                Límite máximo de archivos alcanzado ({{ maxFiles }})
              </span>
            </p>
            <p class="text-xs text-gray-500">
              Máximo 5 MB por archivo. Hasta {{ maxFiles }} archivos. ({{ uploadedFiles.length }}/{{ maxFiles }})
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Mensaje de error -->
    <p v-if="fileError" class="mt-3 text-sm text-red-600">
      {{ fileError }}
    </p>

    <!-- Lista de archivos -->
    <div v-if="uploadedFiles.length > 0" class="mt-4 space-y-3">
      <div v-for="(file, index) in uploadedFiles" :key="index" class="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100">
            <span class="text-sm font-semibold text-blue-700 uppercase">{{ fileExtension(file.name) }}</span>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-800">
              {{ file.name }}
            </p>
            <p class="text-xs text-gray-500">
              Extensión: .{{ fileExtension(file.name) }} · Peso: {{ formatBytes(file.size) }}
            </p>
          </div>
        </div>
        <button
          type="button"
          @click="removeFile(index)"
          class="inline-flex items-center justify-center h-8 w-8 rounded-md border border-gray-300 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition"
          title="Quitar archivo"
          aria-label="Quitar archivo"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- Botón para limpiar todos los archivos -->
    <div v-if="uploadedFiles.length > 0" class="mt-4 flex justify-end">
      <button
        type="button"
        @click="clearAllFiles"
        class="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Limpiar todos los archivos
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  maxFiles: {
    type: Number,
    default: 8
  },
  maxSize: {
    type: Number,
    default: 5 * 1024 * 1024 // 5MB
  }
})

const emit = defineEmits(['update:modelValue'])

const fileInput = ref(null)
const uploadedFiles = ref([...props.modelValue])
const fileError = ref('')
const dragging = ref(false)

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  uploadedFiles.value = [...newValue]
}, { deep: true })

// Watch for internal changes and emit to parent
watch(uploadedFiles, (newFiles) => {
  emit('update:modelValue', [...newFiles])
}, { deep: true })

const triggerBrowse = () => {
  if (uploadedFiles.value.length >= props.maxFiles) return
  fileInput.value?.click()
}

const onFileChange = (e) => {
  const files = Array.from(e.target.files || [])
  if (!files.length) return
  
  files.forEach(file => tryAttachFile(file))
  
  // limpiar el input para permitir volver a seleccionar archivos
  e.target.value = ''
}

const handleDrop = (e) => {
  dragging.value = false
  const dt = e.dataTransfer
  if (!dt || !dt.files?.length) return
  
  const files = Array.from(dt.files)
  files.forEach(file => tryAttachFile(file))
}

const tryAttachFile = (file) => {
  fileError.value = ''
  
  // Verificar límite de archivos
  if (uploadedFiles.value.length >= props.maxFiles) {
    fileError.value = `No se pueden agregar más de ${props.maxFiles} archivos`
    return
  }
  
  // Verificar si el archivo ya existe
  const existingFile = uploadedFiles.value.find(f => f.name === file.name && f.size === file.size)
  if (existingFile) {
    fileError.value = `El archivo "${file.name}" ya está agregado`
    return
  }
  
  // Verificar extensión
  const isXmlByExt = file.name.toLowerCase().endsWith('.xml')
  const isXmlByMime = (file.type || '').includes('xml') // text/xml o application/xml
  if (!isXmlByExt && !isXmlByMime) {
    fileError.value = 'Solo se permiten archivos con extensión .xml'
    return
  }
  
  // Verificar tamaño
  if (file.size > props.maxSize) {
    fileError.value = `El archivo "${file.name}" supera el límite de ${formatBytes(props.maxSize)}`
    return
  }
  
  // Agregar archivo a la lista
  uploadedFiles.value.push(file)
}

const removeFile = (index) => {
  uploadedFiles.value.splice(index, 1)
  fileError.value = ''
}

const clearAllFiles = () => {
  uploadedFiles.value = []
  fileError.value = ''
}

const fileExtension = (name) => {
  const parts = name.split('.')
  return parts.length > 1 ? parts.pop().toLowerCase() : ''
}

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 2)} ${sizes[i]}`
}
</script>