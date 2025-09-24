import { BaseService } from "@/api/api";

const RECURSO = "/acta-recepcion";

export class ActaRecepcionServicio extends BaseService {
    constructor(opciones = {}) {
        super(RECURSO, opciones);
}

  /** Obtener detalle por id */
async obtenerActaRecepcion(id, opts = {}) {
    return this.detalle(id, opts);
}

  /** Crear acta de recepción */
async crearActaRecepcion(payload, opts = {}) {
    const body = mapearPayloadActaRecepcion(payload);
    return this.crear(body, opts);
}

  /** Editar acta de recepción (PATCH por defecto) */
async editarActaRecepcion(id, payload, parcial = true, opts = {}) {
    const body = mapearPayloadActaRecepcion(payload);
    return parcial
        ? this.actualizarParcial(id, body, opts)
        : this.actualizar(id, body, opts);
}
}

// --------- helper fuera de la clase ---------
function mapearPayloadActaRecepcion(p) {
if (!p) throw new Error("mapearPayload: payload requerido");
const body = {
    acta_id: p.acta_id != null ? Number(p.acta_id) : null,
    fecha_entrega: p.fecha_entrega || null,
    fecha_inspeccion: p.fecha_inspeccion || null,
    observacion_recepcion: (p.observacion_recepcion ?? "").toString().trim(),
    detalles: Array.isArray(p.detalles)
    ? p.detalles.map((d) => ({
            acta_recepcion_general: Number(d.acta_recepcion_general),
            producto: Number(d.producto),
            no_cajas: Number(d.no_cajas ?? 0),
            cantidad_recibida: Number(d.cantidad_recibida ?? 0),
            lote: (d.lote ?? "").toString().trim(),
            fecha_vencimiento: d.fecha_vencimiento || null,
            concentracion: (d.concentracion ?? "").toString().trim(),
            marca_dispositivo: (d.marca_dispositivo ?? "").toString().trim(),
            forma_farmacia: (d.forma_farmacia ?? "").toString().trim(),
            unidad_medida: (d.unidad_medida ?? "").toString().trim(),
            cumple: Boolean(d.cumple ?? true),
            observacion_tecnica: (d.observacion_tecnica ?? "").toString().trim(),
        }))
    : [],
};
return body;
}

export default ActaRecepcionServicio;
