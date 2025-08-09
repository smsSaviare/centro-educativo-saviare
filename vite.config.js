import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Establece la ruta base para el despliegue en GitHub Pages.
  // Es el nombre de tu repositorio.
  base: '/saviare/',
  plugins: [react()],
});
