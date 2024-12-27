import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    middlewareMode: false,
  },
  build: {
    outDir: 'dist',
  },
  // This handles the SPA fallback for Vite
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
