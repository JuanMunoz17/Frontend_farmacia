import { BaseService } from "@/api/api";

// Backend expone 'tipoproductos/' (plural), ver urls actualizadas
const RECURSO = "/tipo-productos";

export class TipoProductoServicio extends BaseService {
  constructor(opciones = {}) {
    super(RECURSO, opciones);
  }

  /**
   * Buscar tipos de producto con paginación
   */
  async buscar(params = {}, opts = {}) {
    const q = {};
    if (params.search) q.search = params.search;
    if (params.page) q.page = params.page;
    if (params.page_size) q.page_size = params.page_size;

    console.log("🔄 TipoProductoServicio - Parámetros de búsqueda:", q);
    const resultado = await this.listar(q, opts);
    console.log("📥 TipoProductoServicio - Resultado búsqueda:", resultado);

    return resultado;
  }

  /**
   * Listar todos los tipos de producto (para formularios)
   */
  async listarTodos(opts = {}) {
    try {
      console.log("🔄 TipoProductoServicio - Obteniendo todos los tipos...");

      const resultado = await this.listar({}, opts);
      console.log("📥 TipoProductoServicio - Respuesta recibida:", resultado);

      // Normalizar respuesta - manejar diferentes formatos del backend
      let tipos = [];
      if (Array.isArray(resultado)) {
        tipos = resultado;
      } else if (resultado.results && Array.isArray(resultado.results)) {
        tipos = resultado.results;
      } else if (resultado.data && Array.isArray(resultado.data)) {
        tipos = resultado.data;
      }

      console.log("✅ TipoProductoServicio - Tipos normalizados:", tipos);
      return tipos;
    } catch (error) {
      console.error("❌ TipoProductoServicio - Error en listarTodos:", error);
      throw error;
    }
  }

  /**
   * Obtener opciones para select (formato label/value)
   */
  async obtenerOpcionesSelect(params = {}, opts = {}) {
    try {
      const tipos = await this.listarTodos(opts);

      // Mapear a formato { label, value } para selects
      const opciones = tipos.map((tipo) => ({
        label: tipo.clasificacion || `Tipo ${tipo.id}`,
        value: tipo.id,
        ...tipo, // mantener datos originales
      }));

      console.log("✅ TipoProductoServicio - Opciones para select:", opciones);
      return opciones;
    } catch (error) {
      console.error(
        "❌ TipoProductoServicio - Error en obtenerOpcionesSelect:",
        error
      );
      return [];
    }
  }

  /**
   * Obtener detalle de un tipo específico
   */
  detalle(id, opts = {}) {
    console.log(`🔄 TipoProductoServicio - Obteniendo detalle ID: ${id}`);
    return super.detalle(id, opts);
  }

  /**
   * Crear nuevo tipo de producto
   */
  crearTipo(payload, opts = {}) {
    const body = {
      clasificacion: (payload?.clasificacion ?? "").trim(),
    };
    console.log("💾 TipoProductoServicio - Creando tipo:", body);
    return super.crear(body, opts);
  }

  /**
   * Editar tipo de producto
   */
  editarTipo(id, payload, parcial = true, opts = {}) {
    const body = {
      clasificacion: (payload?.clasificacion ?? "").trim(),
    };
    console.log(`✏️ TipoProductoServicio - Editando tipo ${id}:`, body);
    return parcial
      ? super.actualizarParcial(id, body, opts)
      : super.actualizar(id, body, opts);
  }

  /**
   * Eliminar tipo de producto
   */
  eliminarTipo(id, opts = {}) {
    console.log(`🗑️ TipoProductoServicio - Eliminando tipo ID: ${id}`);
    return super.eliminar(id, opts);
  }
}

export default TipoProductoServicio;