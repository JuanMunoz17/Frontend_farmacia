<template>
  <div class="border-t pt-6">
    <h4 class="text-lg font-medium text-gray-800 mb-4">Archivos XML de facturas</h4>

    <div class="relative">
      <!-- Input para archivos individuales -->
      <input
        ref="fileInput"
        type="file"
        accept=".xml,application/xml,text/xml"
        multiple
        class="hidden"
        @change="onFileChange"
      />

      <!-- Input para carpetas -->
      <input
        ref="folderInput"
        type="file"
        webkitdirectory
        multiple
        class="hidden"
        @change="onFolderChange"
      />

      <div class="group">
        <div
          @dragover.prevent="dragging = true"
          @dragleave.prevent="dragging = false"
          @drop.prevent="handleDrop"
          :class="[
            'w-full border-2 border-dashed rounded-xl p-8 text-center transition',
            dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50',
            uploadedFiles.length >= maxFiles ? 'opacity-50' : 'cursor-pointer'
          ]"
          role="button"
          tabindex="0"
        >
          <div class="flex flex-col items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M3 15a4 4 0 014-4h1m0 0a4 4 0 118 0h1a4 4 0 014 4v2a3 3 0 01-3 3H6a3 3 0 01-3-3v-2z" />
            </svg>
            <p class="text-sm text-gray-700">
              <span v-if="uploadedFiles.length < maxFiles">
                Arrastra y suelta <span class="font-medium">archivos .xml</span> o <span class="font-medium">carpetas</span> aquí
              </span>
              <span v-else class="text-gray-500">
                Límite máximo de archivos alcanzado ({{ maxFiles }})
              </span>
            </p>
            
            <!-- Botones para seleccionar archivos o carpetas -->
            <div v-if="uploadedFiles.length < maxFiles" class="flex gap-2 mt-2">
              <button
                type="button"
                @click="triggerBrowseFiles"
                class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                📄 Seleccionar Archivos
              </button>
              <button
                type="button"
                @click="triggerBrowseFolder"
                class="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                📁 Seleccionar Carpeta
              </button>
            </div>
            
            <p class="text-xs text-gray-500">
              Máximo 5 MB por archivo. Hasta {{ maxFiles }} archivos. ({{ uploadedFiles.length }}/{{ maxFiles }})
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Mensaje de información sobre procesamiento de carpeta -->
    <div v-if="processingFolder" class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div class="flex items-center gap-2">
        <svg class="animate-spin h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-sm text-blue-700">Procesando carpeta... Encontrados {{ foundXmlFiles }} archivos XML</span>
      </div>
    </div>

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
              <span v-if="file.webkitRelativePath">
                📁 {{ getFolderPath(file.webkitRelativePath) }} · 
              </span>
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
        Limpiar todos los archivos ({{ uploadedFiles.length }})
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

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
const folderInput = ref(null)
const uploadedFiles = ref([...props.modelValue])
const dragging = ref(false)
const processingFolder = ref(false)
const foundXmlFiles = ref(0)

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  uploadedFiles.value = [...newValue]
}, { deep: true })

// Watch for internal changes and emit to parent
watch(uploadedFiles, (newFiles) => {
  emit('update:modelValue', [...newFiles])
}, { deep: true })

const triggerBrowseFiles = () => {
  if (uploadedFiles.value.length >= props.maxFiles) {
    toast.warning(`Ya has alcanzado el límite máximo de ${props.maxFiles} archivos`, {
      position: 'top-right',
      autoClose: 3000
    })
    return
  }
  fileInput.value?.click()
}

const triggerBrowseFolder = () => {
  if (uploadedFiles.value.length >= props.maxFiles) {
    toast.warning(`Ya has alcanzado el límite máximo de ${props.maxFiles} archivos`, {
      position: 'top-right',
      autoClose: 3000
    })
    return
  }
  folderInput.value?.click()
}

const onFileChange = (e) => {
  const files = Array.from(e.target.files || [])
  if (!files.length) return
  
  const addedFiles = []
  const rejectedFiles = []
  
  files.forEach(file => {
    // Validar inmediatamente si es XML antes de procesarlo
    if (!isXmlFile(file)) {
      rejectedFiles.push(file.name)
      return
    }
    
    if (tryAttachFile(file)) {
      addedFiles.push(file.name)
    }
  })
  
  // Notificaciones de archivos rechazados
  if (rejectedFiles.length > 0) {
    toast.error(`Archivos rechazados (no XML): ${rejectedFiles.join(', ')}`, {
      position: 'top-right',
      autoClose: 4000
    })
  }
  
  // Notificación de éxito si se agregaron archivos
  if (addedFiles.length > 0) {
    if (addedFiles.length === 1) {
      toast.success(`✅ Archivo "${addedFiles[0]}" agregado correctamente`, {
        position: 'top-right',
        autoClose: 2500
      })
    } else {
      toast.success(`✅ ${addedFiles.length} archivos agregados correctamente`, {
        position: 'top-right',
        autoClose: 2500
      })
    }
  }
  
  // limpiar el input para permitir volver a seleccionar archivos
  e.target.value = ''
}

const onFolderChange = async (e) => {
  const files = Array.from(e.target.files || [])
  if (!files.length) return
  
  processingFolder.value = true
  foundXmlFiles.value = 0
  
  // Mostrar notificación de procesamiento
  const loadingToast = toast.loading('🔄 Procesando carpeta...', {
    position: 'top-right'
  })
  
  try {
    // Filtrar solo archivos XML con validación estricta
    const xmlFiles = []
    const rejectedFiles = []
    
    files.forEach(file => {
      if (isXmlFile(file)) {
        xmlFiles.push(file)
        foundXmlFiles.value++
      } else {
        rejectedFiles.push(file.name)
      }
    })
    
    // Mostrar archivos rechazados si los hay
    if (rejectedFiles.length > 0) {
      console.log(`Archivos no XML ignorados: ${rejectedFiles.length}`)
    }
    
    if (xmlFiles.length === 0) {
      toast.update(loadingToast, {
        render: '⚠️ No se encontraron archivos XML en la carpeta seleccionada',
        type: 'warning',
        isLoading: false,
        position: 'top-right',
        autoClose: 4000
      })
      return
    }
    
    // Verificar si podemos agregar todos los archivos
    const totalFiles = uploadedFiles.value.length + xmlFiles.length
    let filesToProcess = xmlFiles
    
    if (totalFiles > props.maxFiles) {
      const availableSlots = props.maxFiles - uploadedFiles.value.length
      if (availableSlots <= 0) {
        toast.update(loadingToast, {
          render: `❌ No hay espacio disponible. Límite máximo: ${props.maxFiles} archivos`,
          type: 'error',
          isLoading: false,
          position: 'top-right',
          autoClose: 4000
        })
        return
      }
      
      filesToProcess = xmlFiles.slice(0, availableSlots)
      toast.update(loadingToast, {
        render: `⚠️ Solo se procesarán ${availableSlots} de ${xmlFiles.length} archivos (límite alcanzado)`,
        type: 'warning',
        isLoading: false,
        position: 'top-right',
        autoClose: 4000
      })
    }
    
    // Procesar archivos uno por uno sin delay innecesario
    const addedFiles = []
    for (const file of filesToProcess) {
      if (uploadedFiles.value.length >= props.maxFiles) break
      if (tryAttachFile(file, true)) { // true indica que viene de carpeta
        addedFiles.push(file.name)
      }
    }
    
    // Notificación final de éxito
    if (addedFiles.length > 0) {
      toast.update(loadingToast, {
        render: `✅ ${addedFiles.length} archivos XML agregados desde la carpeta`,
        type: 'success',
        isLoading: false,
        position: 'top-right',
        autoClose: 3000
      })
    } else {
      toast.update(loadingToast, {
        render: '⚠️ No se pudieron agregar archivos (posibles duplicados o errores)',
        type: 'warning',
        isLoading: false,
        position: 'top-right',
        autoClose: 3000
      })
    }
    
  } catch (error) {
    toast.update(loadingToast, {
      render: `❌ Error procesando carpeta: ${error.message}`,
      type: 'error',
      isLoading: false,
      position: 'top-right',
      autoClose: 4000
    })
  } finally {
    processingFolder.value = false
    foundXmlFiles.value = 0
    // limpiar el input
    e.target.value = ''
  }
}

const handleDrop = async (e) => {
  dragging.value = false
  const dt = e.dataTransfer
  if (!dt) return
  
  // Primero intentar manejo simple de archivos
  const files = Array.from(dt.files || [])
  
  if (files.length > 0) {
    // Manejo directo de archivos con validación previa estricta
    const addedFiles = []
    const rejectedFiles = []
    
    files.forEach(file => {
      // Validar inmediatamente si es XML
      if (!isXmlFile(file)) {
        rejectedFiles.push(file.name)
        return
      }
      
      if (tryAttachFile(file)) {
        addedFiles.push(file.name)
      }
    })
    
    // Notificaciones de archivos rechazados
    if (rejectedFiles.length > 0) {
      toast.error(`❌ Archivos rechazados (no XML): ${rejectedFiles.join(', ')}`, {
        position: 'top-right',
        autoClose: 4000
      })
    }
    
    if (addedFiles.length > 0) {
      if (addedFiles.length === 1) {
        toast.success(`✅ Archivo "${addedFiles[0]}" agregado correctamente`, {
          position: 'top-right',
          autoClose: 2500
        })
      } else {
        toast.success(`✅ ${addedFiles.length} archivos agregados correctamente`, {
          position: 'top-right',
          autoClose: 2500
        })
      }
    }
    
    return // Salir aquí, no procesar carpetas si hay archivos directos
  }
  
  // Solo si no hay archivos directos, intentar procesar carpetas
  const items = Array.from(dt.items || [])
  
  if (items.length > 0) {
    // Verificar si hay carpetas antes de empezar procesamiento pesado
    const hasDirectories = items.some(item => {
      const entry = item.webkitGetAsEntry?.()
      return entry?.isDirectory
    })
    
    if (!hasDirectories) {
      toast.warning('⚠️ No se detectaron carpetas ni archivos XML válidos', {
        position: 'top-right',
        autoClose: 3000
      })
      return
    }
    
    // Manejo avanzado con DataTransferItemList (soporte para carpetas)
    processingFolder.value = true
    foundXmlFiles.value = 0
    
    const loadingToast = toast.loading('🔄 Procesando elementos arrastrados...', {
      position: 'top-right'
    })
    
    try {
      const allFiles = []
      
      for (const item of items) {
        if (item.kind === 'file') {
          const entry = item.webkitGetAsEntry()
          if (entry) {
            if (entry.isDirectory) {
              const folderFiles = await readDirectory(entry)
              allFiles.push(...folderFiles)
            } else if (entry.isFile) {
              const file = item.getAsFile()
              if (file && isXmlFile(file)) {
                allFiles.push(file)
              }
            }
          }
        }
      }
      
      foundXmlFiles.value = allFiles.length
      
      if (allFiles.length === 0) {
        toast.update(loadingToast, {
          render: '⚠️ No se encontraron archivos XML en los elementos soltados',
          type: 'warning',
          isLoading: false,
          position: 'top-right',
          autoClose: 3000
        })
        return
      }
      
      // Verificar límite
      const totalFiles = uploadedFiles.value.length + allFiles.length
      let filesToProcess = allFiles
      
      if (totalFiles > props.maxFiles) {
        const availableSlots = props.maxFiles - uploadedFiles.value.length
        filesToProcess = allFiles.slice(0, Math.max(0, availableSlots))
        
        if (availableSlots <= 0) {
          toast.update(loadingToast, {
            render: `❌ No hay espacio disponible. Límite máximo: ${props.maxFiles} archivos`,
            type: 'error',
            isLoading: false,
            position: 'top-right',
            autoClose: 4000
          })
          return
        }
      }
      
      // Agregar archivos
      const addedFiles = []
      filesToProcess.forEach(file => {
        if (tryAttachFile(file, true)) {
          addedFiles.push(file.name)
        }
      })
      
      if (addedFiles.length > 0) {
        toast.update(loadingToast, {
          render: `✅ ${addedFiles.length} archivos XML agregados`,
          type: 'success',
          isLoading: false,
          position: 'top-right',
          autoClose: 3000
        })
      } else {
        toast.update(loadingToast, {
          render: '⚠️ No se pudieron agregar archivos',
          type: 'warning',
          isLoading: false,
          position: 'top-right',
          autoClose: 3000
        })
      }
      
    } catch (error) {
      toast.update(loadingToast, {
        render: `❌ Error procesando elementos: ${error.message}`,
        type: 'error',
        isLoading: false,
        position: 'top-right',
        autoClose: 4000
      })
    } finally {
      processingFolder.value = false
    }
  }
}

// Función recursiva para leer directorios con timeout y validación estricta
const readDirectory = (directoryEntry) => {
  return new Promise((resolve, reject) => {
    // Timeout global para toda la operación de directorio
    const globalTimeout = setTimeout(() => {
      reject(new Error('Timeout leyendo directorio'))
    }, 10000) // 10 segundos máximo
    
    const files = []
    const reader = directoryEntry.createReader()
    
    const readEntries = () => {
      reader.readEntries(async (entries) => {
        try {
          if (entries.length === 0) {
            clearTimeout(globalTimeout)
            resolve(files)
            return
          }
          
          for (const entry of entries) {
            if (entry.isFile) {
              // Validar extensión ANTES de obtener el archivo
              if (entry.name.toLowerCase().endsWith('.xml')) {
                try {
                  const file = await getFileFromEntry(entry)
                  if (file && isXmlFile(file)) {
                    files.push(file)
                  }
                } catch (error) {
                  console.warn(`Error procesando archivo ${entry.name}:`, error)
                  // Continuar con el siguiente archivo, no fallar todo
                }
              }
            } else if (entry.isDirectory) {
              try {
                const subFiles = await readDirectory(entry)
                files.push(...subFiles)
              } catch (error) {
                console.warn(`Error procesando directorio ${entry.name}:`, error)
                // Continuar con el siguiente directorio, no fallar todo
              }
            }
          }
          
          readEntries() // Continuar leyendo
        } catch (error) {
          clearTimeout(globalTimeout)
          reject(error)
        }
      }, (error) => {
        clearTimeout(globalTimeout)
        console.error('Error reading directory entries:', error)
        resolve(files) // Resolver con los archivos encontrados hasta ahora
      })
    }
    
    readEntries()
  })
}

// Obtener archivo desde FileEntry con timeout más corto
const getFileFromEntry = (fileEntry) => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`Timeout procesando ${fileEntry.name}`))
    }, 2000) // 2 segundos de timeout (reducido)
    
    fileEntry.file(
      (file) => {
        clearTimeout(timeout)
        resolve(file)
      }, 
      (error) => {
        clearTimeout(timeout)
        reject(error)
      }
    )
  })
}

// Validación MÁS ESTRICTA para archivos XML
const isXmlFile = (file) => {
  if (!file || !file.name) return false
  
  const fileName = file.name.toLowerCase().trim()
  
  // SOLO verificar extensión .xml - es lo más confiable
  const hasXmlExtension = fileName.endsWith('.xml')
  
  // Rechazar inmediatamente si no tiene extensión .xml
  if (!hasXmlExtension) {
    return false
  }
  
  // Verificaciones adicionales para mayor seguridad
  const fileType = (file.type || '').toLowerCase()
  
  // Si tiene MIME type, debe ser XML-compatible
  if (fileType && !fileType.includes('xml') && fileType !== 'text/plain' && fileType !== '') {
    return false
  }
  
  return true
}

const tryAttachFile = (file, fromFolder = false) => {
  // Verificar límite de archivos
  if (uploadedFiles.value.length >= props.maxFiles) {
    if (!fromFolder) {
      toast.error(`❌ No se pueden agregar más de ${props.maxFiles} archivos`, {
        position: 'top-right',
        autoClose: 3000
      })
    }
    return false
  }
  
  // Verificar si el archivo ya existe (por nombre y tamaño)
  const existingFile = uploadedFiles.value.find(f => 
    f.name === file.name && f.size === file.size
  )
  if (existingFile) {
    if (!fromFolder) {
      toast.warning(`⚠️ El archivo "${file.name}" ya está agregado`, {
        position: 'top-right',
        autoClose: 3000
      })
    }
    return false
  }
  
  // Verificar extensión (validación final de seguridad)
  if (!isXmlFile(file)) {
    if (!fromFolder) {
      toast.error(`❌ "${file.name}" no es un archivo XML válido`, {
        position: 'top-right',
        autoClose: 3000
      })
    }
    return false
  }
  
  // Verificar tamaño
  if (file.size > props.maxSize) {
    if (!fromFolder) {
      toast.error(`❌ El archivo "${file.name}" supera el límite de ${formatBytes(props.maxSize)}`, {
        position: 'top-right',
        autoClose: 4000
      })
    }
    return false
  }
  
  // Verificar que el archivo no esté vacío
  if (file.size === 0) {
    if (!fromFolder) {
      toast.error(`❌ El archivo "${file.name}" está vacío`, {
        position: 'top-right',
        autoClose: 3000
      })
    }
    return false
  }
  
  // Agregar archivo a la lista
  uploadedFiles.value.push(file)
  return true
}

const removeFile = (index) => {
  const fileName = uploadedFiles.value[index]?.name
  uploadedFiles.value.splice(index, 1)
  
  toast.info(`🗑️ Archivo "${fileName}" eliminado`, {
    position: 'top-right',
    autoClose: 2000
  })
}

const clearAllFiles = () => {
  const fileCount = uploadedFiles.value.length
  uploadedFiles.value = []
  
  toast.info(`🗑️ ${fileCount} archivo${fileCount === 1 ? '' : 's'} eliminado${fileCount === 1 ? '' : 's'}`, {
    position: 'top-right',
    autoClose: 2500
  })
}

const fileExtension = (name) => {
  const parts = name.split('.')
  return parts.length > 1 ? parts.pop().toLowerCase() : ''
}

const getFolderPath = (relativePath) => {
  if (!relativePath) return ''
  const parts = relativePath.split('/')
  return parts.slice(0, -1).join('/') || 'Raíz'
}

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 2)} ${sizes[i]}`
}
</script>