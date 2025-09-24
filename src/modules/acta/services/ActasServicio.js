import { BaseService } from '@/api/api'

// Endpoints expuestos por tu backend (views.py / urls.py)
const RECURSO_ACTA = '/actas'
const RECURSO_ACTA_RELACIONES = '/actas-relaciones'
const RECURSO_ACTA_ORDEN = '/actas-orden'
const RECURSO_ACTA_FACTURA = '/actas-factura'

export class ActaServicio extends BaseService {
  constructor(opciones = {}) { super(RECURSO_ACTA, opciones) }

  async buscarActas(params = {}, opts = {}) {
    const q = {}
    if (params.buscar) q.search = params.buscar
    if (params.pagina) q.page = params.pagina
    if (params.tamanio) q.page_size = params.tamanio
    return this.listar(q, opts)
  }

  async obtenerActa(id, opts = {}) { return this.detalle(id, opts) }

  async crearActa(payload, opts = {}) {
    const body = mapearPayloadActa(payload)
    return this.crear(body, opts)
  }

  // 🚀 NUEVO: crea Acta y sus vínculos (ordenes[], facturas[]) en un solo request.
  // Espera el payload del serializer anidado (ActaCreateWithLinksSerializer):
  // { no_acta, persona_recepcion, opc, fecha_acta, ordenes: [ids], facturas: [ids] }
  async crearActaFull(payload, opts = {}) {
    if (!payload) throw new Error('payload requerido')
    const body = {
      no_acta: (payload.no_acta ?? '').toString().trim(),
      persona_recepcion: (payload.persona_recepcion ?? '').toString().trim(),
      opc: (payload.opc ?? '').toString().trim(),
      fecha_acta: payload.fecha_acta ?? null,
      ordenes: Array.isArray(payload.ordenes) ? payload.ordenes.map(Number).filter(Boolean) : [],
      facturas: Array.isArray(payload.facturas) ? payload.facturas.map(Number).filter(Boolean) : [],
    }
    // hacemos POST directo a /actas-relaciones 
    return (new BaseService(RECURSO_ACTA_RELACIONES)).crear(body, opts)
  }

  async editarActa(id, payload, parcial = true, opts = {}) {
    const body = mapearPayloadActa(payload)
    return parcial ? this.actualizarParcial(id, body, opts) : this.actualizar(id, body, opts)
  }
}

export class ActaOrdenServicio extends BaseService {
  constructor(opciones = {}) { super(RECURSO_ACTA_ORDEN, opciones) }

  async buscarVinculos(params = {}, opts = {}) {
    const q = {}
    if (params.acta) q.acta = Number(params.acta)
    if (params.orden_pedido) q.orden_pedido = Number(params.orden_pedido)
    if (params.pagina) q.page = params.pagina
    if (params.tamanio) q.page_size = params.tamanio
    return this.listar(q, opts)
  }

  async obtenerVinculo(id, opts = {}) { return this.detalle(id, opts) }

  async crearVinculo(payload, opts = {}) {
    const body = mapearPayloadActaOrden(payload)
    return this.crear(body, opts)
  }

  async editarVinculo(id, payload, parcial = true, opts = {}) {
    const body = mapearPayloadActaOrden(payload)
    return parcial ? this.actualizarParcial(id, body, opts) : this.actualizar(id, body, opts)
  }

  async vincularOrdenes(actaId, ordenIds = [], opts = {}) {
    if (!actaId || !Array.isArray(ordenIds)) throw new Error('Parámetros inválidos')
    const results = []
    for (const oid of ordenIds) {
      results.push(await this.crearVinculo({ acta: actaId, orden_pedido: oid }, opts))
    }
    return results
  }
}

export class ActaFacturaServicio extends BaseService {
  constructor(opciones = {}) { super(RECURSO_ACTA_FACTURA, opciones) }

  async buscarVinculos(params = {}, opts = {}) {
    const q = {}
    if (params.acta) q.acta = Number(params.acta)
    if (params.factura) q.factura = Number(params.factura)
    if (params.pagina) q.page = params.pagina
    if (params.tamanio) q.page_size = params.tamanio
    return this.listar(q, opts)
  }

  async obtenerVinculo(id, opts = {}) { return this.detalle(id, opts) }

  async crearVinculo(payload, opts = {}) {
    const body = mapearPayloadActaFactura(payload)
    return this.crear(body, opts)
  }

  async editarVinculo(id, payload, parcial = true, opts = {}) {
    const body = mapearPayloadActaFactura(payload)
    return parcial ? this.actualizarParcial(id, body, opts) : this.actualizar(id, body, opts)
  }

  async vincularFacturas(actaId, facturaIds = [], opts = {}) {
    if (!actaId || !Array.isArray(facturaIds)) throw new Error('Parámetros inválidos')
    const results = []
    for (const fid of facturaIds) {
      results.push(await this.crearVinculo({ acta: actaId, factura: fid }, opts))
    }
    return results
  }
}

// ----------------- helpers -----------------
function mapearPayloadActa(a) {
  if (!a) throw new Error('payload requerido')
  return {
    no_acta: (a.no_acta ?? '').toString().trim(),
    persona_recepcion: (a.persona_recepcion ?? '').toString().trim(),
    opc: (a.opc ?? '').toString().trim(),
    fecha_acta: a.fecha_acta ?? null,
  }
}
function mapearPayloadActaOrden(x) {
  if (!x) throw new Error('payload requerido')
  return {
    acta: x.acta != null ? Number(x.acta) : null,
    orden_pedido: x.orden_pedido != null ? Number(x.orden_pedido) : null,
  }
}
function mapearPayloadActaFactura(x) {
  if (!x) throw new Error('Payload requerido')
  return {
    acta: x.acta != null ? Number(x.acta) : null,
    factura: x.factura != null ? Number(x.factura) : null,
  }
}

export default ActaServicio
