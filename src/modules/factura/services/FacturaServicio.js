// src/modules/facturas/services/FacturaServicio.js
// SOLO JS. CRUD mínimo para Facturas usando serializer ANIDADO (encabezado + detalles en un único POST/PATCH).

import { BaseService } from '@/api/api'

const RECURSO_FACTURA = '/facturas'

export class FacturaServicio extends BaseService {
  constructor(opciones = {}) {
    super(RECURSO_FACTURA, opciones)
  }

  // LISTAR (GET /facturas/?page=&page_size=&search=)
  async buscarFacturas(params = {}, opts = {}) {
    const q = {}
    if (params.buscar) q.search = params.buscar
    if (params.pagina) q.page = params.pagina
    if (params.tamanio) q.page_size = params.tamanio
    return this.listar(q, opts)
  }

  // OBTENER (GET /facturas/:id/)
  async obtenerFactura(id, opts = {}) {
    return this.detalle(id, opts)
  }

  // CREAR (POST /facturas/) — anidado (incluye proveedor y detalles)
  async crearFactura(payload, opts = {}) {
    const body = mapearPayloadFactura(payload)
    return this.crear(body, opts)
  }

  // EDITAR (PUT/PATCH /facturas/:id/) — reemplaza cabecera + detalles
  async editarFactura(id, payload, parcial = true, opts = {}) {
    const body = mapearPayloadFactura(payload)
    return parcial ? this.actualizarParcial(id, body, opts) : this.actualizar(id, body, opts)
  }
}

// ---------- Helper (fuera de clase; sin TS) ----------
function mapearPayloadFactura(f) {
  if (!f) throw new Error('payload requerido')
  return {
    no_factura: (f.no_factura ?? '').toString().trim(), // solo dígitos; el backend valida
    fecha_factura: f.fecha_factura ?? null,
    proveedor: f.proveedor != null ? Number(f.proveedor) : null, // FK requerida
    observacion: (f.observacion ?? '').toString().trim(),
    detalles: Array.isArray(f.detalles)
      ? f.detalles.map((d) => ({
          producto: Number(d.producto),
          cantidad: Number(d.cantidad ?? 0),
          valor_uni: parseFloat(d.valor_uni ?? 0),
          iva: Number(d.iva ?? 0),
          valor_iva: parseFloat(d.valor_iva ?? 0),
          valor_facturado: parseFloat(d.valor_facturado ?? 0),
        }))
      : [],
  }
}

export default FacturaServicio
