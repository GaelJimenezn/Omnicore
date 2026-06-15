import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // En desarrollo, redirige /api a un emulador local o directamente
      // Vercel serverless functions en dev normalmente se manejan con `vercel dev`
    }
  }
});
