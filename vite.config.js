import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  },
  build: {
    chunkSizeWarningLimit: 9000, // location-vendor (country-state-city) contiene datos de 239 países — esperado
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Form + validación
          'form-vendor': ['react-hook-form', 'zod', '@hookform/resolvers'],
          // Ubicación (el más pesado: ~5MB)
          'location-vendor': ['country-state-city'],
          // Teléfono
          'phone-vendor': ['react-phone-number-input', 'libphonenumber-js'],
          // Selects
          'select-vendor': ['react-select'],
        },
      },
    },
  },
})

