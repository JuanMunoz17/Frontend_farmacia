import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@views': resolve(__dirname, './src/views'),
      '@modules': resolve(__dirname, './src/modules'),
      '@assets': resolve(__dirname, './src/assets'),
      '@api': resolve(__dirname, './src/api'),
      '@router': resolve(__dirname, './src/router'),
      '@shared': resolve(__dirname, './src/modules/shared'),
      '@factura': resolve(__dirname, './src/modules/factura'),
      '@proveedores': resolve(__dirname, './src/modules/proveedores'),
      '@orden-pedido': resolve(__dirname, './src/modules/orden-pedido'),
      '@comparacion': resolve(__dirname, './src/modules/comparacion'),
    }
  }
})
