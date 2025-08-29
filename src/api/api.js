// src/api/api.js
import axios from 'axios'

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL

console.log('API Base URL:', VITE_API_BASE_URL)

if (!VITE_API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL no está definida en las variables de entorno')
}

export const api = axios.create({
    baseURL: VITE_API_BASE_URL,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
})

const esperar = (ms) => new Promise((r) => setTimeout(r, ms))
function calcularEspera(intento, base = 300) {
  const exp = Math.min(intento, 6)
  const delay = base * Math.pow(2, exp - 1)
  return delay + Math.floor(Math.random() * (delay * 0.2))
}

api.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    const config = error?.config || {}
    config.__intentos = config.__intentos || 0

    if (config.__intentos < (config.maxIntentos ?? 3)) {
      config.__intentos += 1
      await esperar(calcularEspera(config.__intentos, config.baseDelay ?? 300))
      return api(config)
    }

    return Promise.reject({
      status: error?.response?.status ?? 0,
      data: error?.response?.data ?? null,
      message:
        error?.response?.data?.detail ||
        error?.message ||
        'Error de red o servidor'
    })
  }
)

export function conSlash(path) {
  return path.endsWith('/') ? path : `${path}/`
}

export class BaseService {
  constructor(ruta, opciones = {}) {
    if (!ruta) throw new Error('BaseService: ruta requerida')
    this.api = opciones.apiInstance || api
    this.recurso = conSlash(ruta)
    this.maxIntentos = opciones.maxIntentos ?? 3
    this.baseDelay = opciones.baseDelay ?? 300
  }

  opcionesRetry(extra = {}) {
    return { maxIntentos: this.maxIntentos, baseDelay: this.baseDelay, ...extra }
  }

  async listar(params = {}, opts = {}) {
    const { data } = await this.api.get(this.recurso, {
      params,
      ...this.opcionesRetry(opts)
    })
    return data
  }

  async detalle(id, opts = {}) {
    if (!id) throw new Error('detalle: id requerido')
    const { data } = await this.api.get(`${this.recurso}${id}/`, this.opcionesRetry(opts))
    return data
  }

  async crear(payload, opts = {}) {
    const { data } = await this.api.post(this.recurso, payload, { ...this.opcionesRetry({ ...opts, maxIntentos: 0 }) })
    return data
  }

  async actualizar(id, payload, opts = {}) {
    const { data } = await this.api.put(`${this.recurso}${id}/`, payload, this.opcionesRetry(opts))
    return data
  }

  async actualizarParcial(id, payload, opts = {}) {
    const { data } = await this.api.patch(`${this.recurso}${id}/`, payload, this.opcionesRetry(opts))
    return data
  }
}
