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
      '/steamgriddb-api': {
        target: 'https://www.steamgriddb.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/steamgriddb-api/, '/api/v2')
      }
    }
  }
});
