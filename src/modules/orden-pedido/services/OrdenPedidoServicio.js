// src/modules/ordenpedido/services/OrdenPedidoServicio.js
import { BaseService } from '@/api/api'

const RECURSO_ORDEN = '/ordenespedido'

export class OrdenPedidoServicio extends BaseService {
  constructor(opciones = {}) {
    super(RECURSO_ORDEN, opciones)
  }

  /**
   * Listar órdenes de pedido con paginación o búsqueda.
   * @param {{buscar?: string, pagina?: number, tamanio?: number}} params
   */
  async buscarOrdenes(params = {}, opts = {}) {
    const query = {}
    if (params.buscar) query.search = params.buscar
    if (params.pagina) query.page = params.pagina
    if (params.tamanio) query.page_size = params.tamanio
    return this.listar(query, opts)
  }

  /**
   * Obtener una orden de pedido por id (incluye detalles gracias al serializer anidado).
   */
  async obtenerOrden(id, opts = {}) {
    return this.detalle(id, opts)
  }

  /**
   * Crear una orden de pedido junto con sus detalles (un solo POST).
   * @param {{no_orden:string, fecha_orden:string, descripcion_interno:string, aprobado:boolean, detalles:Array}} payload
   */
  async crearOrdenConDetalles(payload, opts = {}) {
    if (!payload) throw new Error('crearOrdenConDetalles: payload requerido')

    const body = this.#mapearPayloadOrden(payload)
    return this.crear(body, opts) // backend devuelve {id, ..., detalles:[{id,...}]}
  }

  /**
   * Editar una orden (cabecera + detalles).
   * El backend con serializer anidado se encargará de actualizar registros.
   */
  async editarOrden(id, payload, parcial = false, opts = {}) {
    const body = this.#mapearPayloadOrden(payload)
    return parcial
      ? this.actualizarParcial(id, body, opts)
      : this.actualizar(id, body, opts)
  }

  // ---------- Helpers privados ----------
  #mapearPayloadOrden(o) {
    if (!o) throw new Error('mapearPayloadOrden: payload requerido')

    return {
      no_orden: (o.no_orden ?? '').toString().trim(),
      fecha_orden: o.fecha_orden ?? null,
      descripcion_interno: (o.descripcion_interno ?? '').toString().trim(),
      aprobado: Boolean(o.aprobado ?? false),
      detalles: Array.isArray(o.detalles)
        ? o.detalles.map((d) => ({
            // no enviamos id porque lo genera el backend
            producto: Number(d.producto),
            cantidad_solicitada: Number(d.cantidad_solicitada ?? 0),
            descripcion_orden: (d.descripcion_orden ?? '').toString().trim(),
            valor_unidad: parseFloat(d.valor_unidad ?? 0),
            iva: Number(d.iva ?? 0),
            valor_iva: parseFloat(d.valor_iva ?? 0),
            valor_total: parseFloat(d.valor_total ?? 0)
          }))
        : []
    }
  }
}
