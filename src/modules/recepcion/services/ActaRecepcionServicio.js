import { BaseService } from "@/api/api";

const RECURSO = "/actas-recepcion";

export class ActaRecepcionServicio extends BaseService {
  constructor(opciones = {}) {
    super(RECURSO, opciones);
  }

  /** Obtener detalle por id */
  async obtenerActaRecepcion(id, opts = {}) {
    return this.detalle(id, opts);
  }

  /** Crear acta de recepción (POST) */
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

/* ============================
 *  Mapper: normaliza el payload
 * ============================ */
function mapearPayloadActaRecepcion(p) {
  if (!p) throw new Error("mapearPayload: payload requerido");

  // Acepta tanto `detalles_tecnicos` como `detalles`
  const fuenteDetalles =
    Array.isArray(p.detalles_tecnicos) ? p.detalles_tecnicos
    : Array.isArray(p.detalles) ? p.detalles
    : [];

  const detallesMapeados = fuenteDetalles.map((d) => ({
    producto: numOrNull(d.producto),
    no_cajas: numOrZero(d.no_cajas),
    cantidad_recibida: numOrZero(d.cantidad_recibida),
    lote: strOrEmpty(d.lote),
    fecha_vencimiento: d.fecha_vencimiento || null, // 'YYYY-MM-DD'
    concentracion: strOrEmpty(d.concentracion),
    marca_dispositivo: strOrEmpty(d.marca_dispositivo),
    // Admite `forma_farmacia` (del form) o `forma_farma` (backend)
    forma_farma: strOrEmpty(d.forma_farmacia ?? d.forma_farma),
    unidad_medida: strOrEmpty(d.unidad_medida),
    cumple: boolOrTrue(d.cumple),
    observacion_tecnica: strOrEmpty(d.observacion_tecnica),
  }));

  const body = {
    acta_id: numOrNull(p.acta_id),
    fecha_entrega: p.fecha_entrega || null,     // 'YYYY-MM-DD'
    fecha_inspeccion: p.fecha_inspeccion || null,
    // Admite `observacion_recepcion` (del form) o `observacion_recep` (backend)
    observacion_recep: strOrEmpty(p.observacion_recepcion ?? p.observacion_recep),
    detalles_tecnicos: detallesMapeados,
  };

  // Útil para depurar antes de enviar
  // console.log("[POST body]", JSON.stringify(body, null, 2));

  return body;
}

/* ===== helpers de tipo ===== */
function numOrNull(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
function numOrZero(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
function strOrEmpty(v) {
  return (v ?? "").toString().trim();
}
function boolOrTrue(v) {
  return typeof v === "boolean" ? v : true;
}

export default ActaRecepcionServicio;
