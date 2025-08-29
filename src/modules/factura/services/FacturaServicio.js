// src/modules/facturas/services/FacturaServicio.js
import { BaseService } from '@/api/api'

const RECURSO_FACTURA = '/facturas'
const RECURSO_DETALLE = '/detallefacturas'

export class FacturaServicio extends BaseService {
  constructor(opciones = {}) {
    super(RECURSO_FACTURA, opciones)
    this.detalleSrv = new DetalleFacturaServicio(opciones)
  }

  /**
   * Listar facturas con paginación.
   */
  async buscarFacturas(params = {}, opts = {}) {
    const query = {}
    if (params.pagina) query.page = params.pagina
    if (params.tamanio) query.page_size = params.tamanio
    return this.listar(query, opts)
  }

  /**
   * Obtener una factura por id (solo encabezado).
   */
  async obtenerFactura(id, opts = {}) {
    return this.detalle(id, opts)
  }

  /**
   * Crear factura junto con sus detalles.
   * @param {{no_factura:string, fecha_factura:string, observacion?:string, detalles?:Array}} payload
   */
  async crearFacturaConDetalles(payload, opts = {}) {
    if (!payload) throw new Error('crearFacturaConDetalles: payload requerido')

    // 1) Crear la factura
    const facturaBody = this.#mapearPayloadFactura(payload)
    const facturaCreada = await this.crear(facturaBody, opts)

    // 2) Crear los detalles (si existen)
    if (Array.isArray(payload.detalles) && payload.detalles.length > 0) {
      for (const det of payload.detalles) {
        const detalleBody = this.detalleSrv.mapearPayloadDetalle({
          ...det,
          factura: facturaCreada.id
        })
        await this.detalleSrv.crear(detalleBody, opts)
      }
    }

    return facturaCreada
  }

  // ---------- Helpers privados ----------
  #mapearPayloadFactura(f) {
    return {
      no_factura: (f.no_factura ?? '').toString().trim(),
      fecha_factura: f.fecha_factura ?? null,
      observacion: (f.observacion ?? '').toString().trim()
    }
  }
}

// ================= DETALLE =================
export class DetalleFacturaServicio extends BaseService {
  constructor(opciones = {}) {
    super(RECURSO_DETALLE, opciones)
  }

  async buscarDetalles(params = {}, opts = {}) {
    const query = {}
    if (params.factura) query.factura = params.factura
    if (params.pagina) query.page = params.pagina
    if (params.tamanio) query.page_size = params.tamanio
    return this.listar(query, opts)
  }

  async obtenerDetalle(id, opts = {}) {
    return this.detalle(id, opts)
  }

  async crearDetalle(payload, opts = {}) {
    const body = this.#mapearPayloadDetalle(payload)
    return this.crear(body, opts)
  }

  async editarDetalle(id, payload, parcial = true, opts = {}) {
    const body = this.#mapearPayloadDetalle(payload)
    return parcial ? this.actualizarParcial(id, body, opts) : this.actualizar(id, body, opts)
  }

  // ---------- Helpers privados ----------
  #mapearPayloadDetalle(d) {
    return {
      factura: Number(d.factura),
      producto: Number(d.producto),
      valor_uni: parseFloat(d.valor_uni ?? 0),
      iva: Number(d.iva ?? 0),
      valor_iva: parseFloat(d.valor_iva ?? 0),
      valor_facturado: parseFloat(d.valor_facturado ?? 0)
    }
  }
}
