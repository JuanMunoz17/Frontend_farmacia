// src/modules/productos/services/ProductoServicio.js
import { BaseService } from '@/api/api'

const RECURSO = '/productos'

export class ProductoServicio extends BaseService {
  constructor(opciones = {}) {
    super(RECURSO, opciones)
  }

  /**
   * Buscar productos con paginación o por nombre/id
   */
  async buscarProductos(params = {}, opts = {}) {
    const query = {}
    if (params.buscar) query.search = params.buscar
    if (params.pagina) query.page = params.pagina
    if (params.tamanio) query.page_size = params.tamanio
    return this.listar(query, opts)
  }

  /**
   * Obtener producto por id
   */
  async obtenerProducto(id, opts = {}) {
    return this.detalle(id, opts)
  }

  /**
   * Crear producto
   */
  async crearProducto(payload, opts = {}) {
    const body = this.#mapearPayload(payload)
    return this.crear(body, opts)
  }

  /**
   * Editar producto
   */
  async editarProducto(id, payload, parcial = true, opts = {}) {
    const body = this.#mapearPayload(payload)
    return parcial ? this.actualizarParcial(id, body, opts) : this.actualizar(id, body, opts)
  }

  // --------- helper privado ---------
  #mapearPayload(p) {
    if (!p) throw new Error('mapearPayload: payload requerido')

    return {
      nombre: (p.nombre ?? '').toString().trim(),
      descripcion: (p.descripcion ?? '').toString().trim(),
      precio: parseFloat(p.precio ?? 0),
      stock: Number(p.stock ?? 0),
      activo: Boolean(p.activo ?? true)
    }
  }
}
