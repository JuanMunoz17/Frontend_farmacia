<template>
  <div class="producto-form">
    <h2>Registrar Producto</h2>

    <form @submit.prevent="guardarProducto">
      <div>
        <label>Nombre:</label>
        <input v-model="producto.nombre" type="text" required />
      </div>

      <div>
        <label>Descripción:</label>
        <textarea v-model="producto.descripcion"></textarea>
      </div>

      <div>
        <label>Precio:</label>
        <input v-model.number="producto.precio" type="number" step="0.01" required />
      </div>

      <div>
        <label>Stock:</label>
        <input v-model.number="producto.stock" type="number" min="0" required />
      </div>

      <div>
        <label>Activo:</label>
        <input type="checkbox" v-model="producto.activo" />
      </div>

      <div>
        <button type="submit">Guardar</button>
        <button type="button" @click="resetForm">Limpiar</button>
      </div>
    </form>
  </div>
</template>

<script>
import { ProductoServicio } from '../services/ProductoServicio'

const productoSrv = new ProductoServicio()

export default {
  name: 'ProductoForm',
  data() {
    return {
      producto: {
        nombre: '',
        descripcion: '',
        precio: 0,
        stock: 0,
        activo: true
      }
    }
  },
  methods: {
    async guardarProducto() {
      try {
        await productoSrv.crearProducto(this.producto)
        alert('Producto creado con éxito ✅')
        this.resetForm()
      } catch (error) {
        console.error(error)
        alert('Error al crear el producto ❌')
      }
    },
    resetForm() {
      this.producto = {
        nombre: '',
        descripcion: '',
        precio: 0,
        stock: 0,
        activo: true
      }
    }
  }
}
</script>

<style scoped>
.producto-form {
  max-width: 600px;
  margin: 0 auto;
}
.producto-form div {
  margin-bottom: 12px;
}
</style>




