import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/centro-educativo-saviare/', // 👈 nombre del repo exacto
})
