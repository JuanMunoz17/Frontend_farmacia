// src/modules/proveedores/services/ProveedoresServicio.js
import { BaseService } from '@/api/api'

const RECURSO = '/proveedores'

export class ProveedoresServicio extends BaseService {
  constructor(opciones = {}) {
    super(RECURSO, opciones)
  }

  /**
   * Buscar proveedores con paginación.
   * @param {{buscar?: string, pagina?: number, tamanio?: number}} params
   */
  async buscarProveedores(params = {}, opts = {}) {
    const query = {}
    if (params.buscar) query.search = params.buscar
    if (params.pagina) query.page = params.pagina
    if (params.tamanio) query.page_size = params.tamanio
    return this.listar(query, opts)
  }

  /**
   * Obtener un proveedor por id.
   */
  async obtenerProveedor(id, opts = {}) {
    return this.detalle(id, opts)
  }

  /**
   * Crear proveedor.
   */
  async crearProveedor(payload, opts = {}) {
    const body = this.#mapearPayloadProveedor(payload)
    return this.crear(body, opts)
  }

  /**
   * Editar proveedor (PATCH por defecto).
   */
  async editarProveedor(id, payload, parcial = true, opts = {}) {
    const body = this.#mapearPayloadProveedor(payload)
    return parcial ? this.actualizarParcial(id, body, opts) : this.actualizar(id, body, opts)
  }

  // ---------- Helpers privados ----------
  #mapearPayloadProveedor(p) {
    if (!p) throw new Error('mapearPayloadProveedor: payload requerido')

    const out = {
      tipo_documento: p.tipo_documento,
      no_documento: (p.no_documento ?? '').toString().trim(),
      nombre: (p.nombre ?? '').toString().trim(),
      telefono: (p.telefono ?? '').toString().trim(),
      correo: (p.correo ?? '').toString().trim()
    }

    // Convertir a entero si viene como string
    if (out.tipo_documento != null) {
      const asInt = Number(out.tipo_documento)
      if (!Number.isNaN(asInt)) out.tipo_documento = asInt
    }

    return out
  }
}
