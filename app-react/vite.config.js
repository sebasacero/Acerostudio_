import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

// La app React se publica en /app/ (salida compilada en ../app/, que Vercel sirve como estático).
// Reutiliza js/ciudad.js y css/*.css de la raíz del repo: una sola fuente de verdad.
export default defineConfig({
  plugins: [react()],
  base: '/app/',
  build: { outDir: '../app', emptyOutDir: true },
  // js/ciudad.js (fuera de app-react/) importa "three": se resuelve desde node_modules de este proyecto
  resolve: { alias: { three: fileURLToPath(new URL('./node_modules/three/build/three.module.js', import.meta.url)) } },
  server: { fs: { allow: [fileURLToPath(new URL('..', import.meta.url))] } },
});
