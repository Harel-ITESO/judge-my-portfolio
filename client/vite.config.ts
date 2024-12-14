import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { configDefaults } from 'vitest/config';


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  test:{
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    exclude: [...configDefaults.exclude],
  },
  
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
