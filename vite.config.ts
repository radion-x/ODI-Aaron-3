import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      // string shorthand: /api -> http://localhost:3001/api
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        // Optionally, you can rewrite the path if needed, but for /api -> /api it's not.
        // rewrite: (path) => path.replace(/^\/api/, '') 
      },
    },
  },
});
