import { BaseService } from "@/api/api";

const RECURSO = "/productos";

export class ProductoServicio extends BaseService {
  constructor(opciones = {}) {
    super(RECURSO, opciones);
  }

  /**
   * Listar / buscar productos con paginación.
   */
  async buscarProductos(params = {}, opts = {}) {
    const query = {};
    if (params.buscar) query.search = params.buscar;
    if (params.pagina) query.page = params.pagina;
    if (params.tamanio) query.page_size = params.tamanio;

    console.log("🔄 ProductoServicio - Parámetros enviados:", query);

    try {
      const resultado = await this.listar(query, opts);
      console.log("📥 ProductoServicio - Respuesta recibida:", resultado);

      return {
        results: resultado.results || resultado.data || [],
        count: resultado.count || resultado.total || 0,
        next: resultado.next || null,
        previous: resultado.previous || null,
      };
    } catch (error) {
      console.error("❌ ProductoServicio - Error:", error);
      throw error;
    }
  }

  /** Obtener detalle por id */
  async obtenerProducto(id, opts = {}) {
    return this.detalle(id, opts);
  }

  /** Crear producto */
  async crearProducto(payload, opts = {}) {
    const body = this.#mapearPayload(payload);
    return this.crear(body, opts);
  }

  /** Editar producto (PATCH por defecto) */
  async editarProducto(id, payload, parcial = true, opts = {}) {
    const body = this.#mapearPayload(payload);
    return parcial
      ? this.actualizarParcial(id, body, opts)
      : this.actualizar(id, body, opts);
  }

  // --------- helper privado ---------
  #mapearPayload(p) {
    if (!p) throw new Error("mapearPayload: payload requerido");

    const body = {
      cod_interno: (p.cod_interno ?? "").toString().trim(),
      nombre: (p.nombre ?? "").toString().trim(),
      presentacion: (p.presentacion ?? "").toString().trim(),
      // ← entero (FK) exigido por el serializer: 'tipo_producto'
      tipo_producto: p.tipo_producto != null ? Number(p.tipo_producto) : null,
      // ← alinear con modelo/serializer actuales
      marca: (p.marca ?? "").toString().trim(),
      fabrica: (p.fabrica ?? "").toString().trim(),
      registro_invima: (p.registro_invima ?? "").toString().trim() || null,
      cum: (p.cum ?? "").toString().trim() || null,
      atc: (p.atc ?? "").toString().trim() || null,
      estado: Boolean(p.estado ?? true),
      observacion_precio: (p.observacion_precio ?? "").toString().trim(),
    };

    return body;
  }
}

export default ProductoServicio;