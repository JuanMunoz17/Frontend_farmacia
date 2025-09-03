// src/modules/productos/services/ProductoServicio.js
import { BaseService } from "@/api/api";

const RECURSO = "/productos";

export class ProductoServicio extends BaseService {
  constructor(opciones = {}) {
    super(RECURSO, opciones);
  }

  /**
   * Listar / buscar productos con paginación.
   * DRF espera: ?search=...&page=...&page_size=...
   */
  async buscarProductos(params = {}, opts = {}) {
    const query = {};
    if (params.buscar) query.search = params.buscar;
    if (params.pagina) query.page = params.pagina;
    if (params.tamanio) query.page_size = params.tamanio;
    return this.listar(query, opts);
  }

  /** Obtener detalle por id */
  async obtenerProducto(id, opts = {}) {
    return this.detalle(id, opts);
  }

  /** Crear producto */
  async crearProducto(payload, opts = {}) {
    const body = this.#mapearPayloadProducto(payload);
    return this.crear(body, opts);
  }

  /** Editar producto (PATCH por defecto) */
  async editarProducto(id, payload, parcial = true, opts = {}) {
    const body = this.#mapearPayloadProducto(payload);
    return parcial
      ? this.actualizarParcial(id, body, opts)
      : this.actualizar(id, body, opts);
  }

  // ---------- Helper privado ----------
  #mapearPayloadProducto(p) {
    if (!p) throw new Error("mapearPayloadProducto: payload requerido");

    // Campos exactos del modelo/serializer
    const out = {
      cod_interno: (p.cod_interno ?? "").toString().trim(),
      nombre: (p.nombre ?? "").toString().trim(),
      presentacion: (p.presentacion ?? "").toString().trim(),
      marca: (p.marca ?? "").toString().trim(),
      fabrica: (p.fabrica ?? "").toString().trim(),
      registro_invima: (p.registro_invima ?? "").toString().trim() || null,
      cum: (p.cum ?? "").toString().trim() || null,
      atc: (p.atc ?? "").toString().trim() || null,
      estado: Boolean(p.estado ?? true),
      fecha_vencimiento: p.fecha_vencimiento || null, // YYYY-MM-DD
      observacion_precio: (p.observacion_precio ?? "").toString().trim(),
    };

    return out;
  }
}

export default ProductoServicio;
