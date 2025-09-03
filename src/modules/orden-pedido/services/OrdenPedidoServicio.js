// src/modules/ordenpedido/services/OrdenPedidoServicio.js
// SOLO JS. Corrige el payload para incluir proveedor y enviar los DETALLES anidados en un único POST.
// Crea, lee y actualiza órdenes usando el serializer anidado del backend.

import { BaseService } from '@/api/api'

const RECURSO_ORDEN = '/ordenespedido'

export class OrdenPedidoServicio extends BaseService {
  constructor(opciones = {}) {
    super(RECURSO_ORDEN, opciones)
  }

  // LISTAR (GET /ordenespedido/?search=&page=&page_size=)
  async buscarOrdenes(params = {}, opts = {}) {
    const q = {}
    if (params.buscar) q.search = params.buscar
    if (params.pagina) q.page = params.pagina
    if (params.tamanio) q.page_size = params.tamanio
    return this.listar(q, opts)
  }

  // OBTENER (GET /ordenespedido/:id/)
  async obtenerOrden(id, opts = {}) {
    return this.detalle(id, opts)
  }

  // CREAR (POST /ordenespedido/) — serializer anidado (incluye proveedor y detalles)
  async crearOrden(payload, opts = {}) {
    const body = mapearPayloadOrden(payload)
    return this.crear(body, opts)
  }

  // EDITAR (PUT/PATCH /ordenespedido/:id/)
  async editarOrden(id, payload, parcial = true, opts = {}) {
    const body = mapearPayloadOrden(payload)
    return parcial ? this.actualizarParcial(id, body, opts) : this.actualizar(id, body, opts)
  }
}

// ---------- Helper (fuera de la clase; sin TS, sin campos privados) ----------
function mapearPayloadOrden(o) {
  if (!o) throw new Error('payload requerido')
  return {
    no_orden: (o.no_orden ?? '').toString().trim(),
    fecha_orden: o.fecha_orden ?? null,
    proveedor: o.proveedor != null ? Number(o.proveedor) : null, // 👈 requerido por el serializer
    descripcion_interno: (o.descripcion_interno ?? '').toString().trim(),
    aprobado: Boolean(o.aprobado ?? false),
    detalles: Array.isArray(o.detalles)
      ? o.detalles.map((d) => ({
          producto: Number(d.producto),
          cantidad_solicitada: Number(d.cantidad_solicitada ?? 0),
          descripcion_orden: (d.descripcion_orden ?? '').toString().trim(),
          valor_unidad: parseFloat(d.valor_unidad ?? 0),
          iva: Number(d.iva ?? 0),
          valor_iva: parseFloat(d.valor_iva ?? 0),
          valor_total: parseFloat(d.valor_total ?? 0),
        }))
      : [],
  }
}

export default OrdenPedidoServicio
