// src/modules/ordenpedido/services/OrdenPedidoServicio.js
import { BaseService } from '@/api/api'

const RECURSO_ORDEN = '/ordenespedido'
const RECURSO_DETALLE = '/ordenesdetalle'

export class OrdenPedidoServicio extends BaseService {
  constructor(opciones = {}) {
    super(RECURSO_ORDEN, opciones)
    this.detalleSrv = new OrdenDetalleServicio(opciones)
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
   * Obtener una orden de pedido por id (solo cabecera).
   */
  async obtenerOrden(id, opts = {}) {
    return this.detalle(id, opts)
  }

  /**
   * Crear una orden de pedido junto con sus detalles.
   * @param {{no_orden:string, fecha_orden:string, descripcion_interno:string, aprobado:boolean, detalles:Array}} payload
   */
  async crearOrdenConDetalles(payload, opts = {}) {
    if (!payload) throw new Error('crearOrdenConDetalles: payload requerido')

    // 1) Crear la orden (cabecera)
    const ordenBody = this.#mapearPayloadOrden(payload)
    const ordenCreada = await this.crear(ordenBody, opts)

    // 2) Crear los detalles (si existen)
    if (Array.isArray(payload.detalles) && payload.detalles.length > 0) {
      for (const det of payload.detalles) {
        const detalleBody = this.detalleSrv.mapearPayloadDetalle({
          ...det,
          orden_pedido: ordenCreada.id
        })
        await this.detalleSrv.crear(detalleBody, opts)
      }
    }

    return ordenCreada
  }

  /**
   * Editar una orden (solo la cabecera).
   */
  async editarOrden(id, payload, parcial = true, opts = {}) {
    const body = this.#mapearPayloadOrden(payload)
    return parcial ? this.actualizarParcial(id, body, opts) : this.actualizar(id, body, opts)
  }

  // ---------- Helpers privados ----------
  #mapearPayloadOrden(o) {
    if (!o) throw new Error('mapearPayloadOrden: payload requerido')

    return {
      no_orden: (o.no_orden ?? '').toString().trim(),
      fecha_orden: o.fecha_orden ?? null,
      descripcion_interno: (o.descripcion_interno ?? '').toString().trim(),
      aprobado: Boolean(o.aprobado ?? false)
    }
  }
}

// ================= DETALLE ORDEN =================
export class OrdenDetalleServicio extends BaseService {
  constructor(opciones = {}) {
    super(RECURSO_DETALLE, opciones)
  }

  async buscarDetalles(params = {}, opts = {}) {
    const query = {}
    if (params.orden_pedido) query.orden_pedido = params.orden_pedido
    if (params.pagina) query.page = params.pagina
    if (params.tamanio) query.page_size = params.tamanio
    return this.listar(query, opts)
  }

  async obtenerDetalle(id, opts = {}) {
    return this.detalle(id, opts)
  }

  async crear(payload, opts = {}) {
    const body = this.mapearPayloadDetalle(payload)
    return super.crear(body, opts)
  }

  async editarDetalle(id, payload, parcial = true, opts = {}) {
    const body = this.mapearPayloadDetalle(payload)
    return parcial ? this.actualizarParcial(id, body, opts) : this.actualizar(id, body, opts)
  }

  // ---------- Helpers ----------
  mapearPayloadDetalle(d) {
    if (!d) throw new Error('mapearPayloadDetalle: payload requerido')

    return {
      orden_pedido: Number(d.orden_pedido),
      producto: Number(d.producto),
      cantidad_solicitada: Number(d.cantidad_solicitada ?? 0),
      descripcion_orden: (d.descripcion_orden ?? '').toString().trim(),
      valor_unidad: parseFloat(d.valor_unidad ?? 0),
      iva: Number(d.iva ?? 0),
      valor_iva: parseFloat(d.valor_iva ?? 0),
      valor_total: parseFloat(d.valor_total ?? 0)
    }
  }
}
