// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import tailwindcss from '@tailwindcss/vite';

// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   resolve: {
//     alias: {
//       '@': '/src',
//     },
//   },
//   server: {
//     proxy: {
//       '/api': {
//         target: 'https://textile-admin-panel-6k2c.onrender.com',
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api/, ''),
//         secure: false,
//       },
//     }
//   }
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    proxy: {
      // Proxy all API requests to the deployed backend
      '/api': {
        target: 'https://textile-admin-panel-6k2c.onrender.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'), // Keep the /api prefix
      },
      // Proxy the ping endpoint separately
      '/ping': {
        target: 'https://textile-admin-panel-6k2c.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // Optional: Configure build settings for production
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});