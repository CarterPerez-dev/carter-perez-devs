// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      include: '**/*.{jsx,js}',
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'), 
    },
  },
  server: {
    host: '0.0.0.0', 
    port: 5173,    
    strictPort: true, 
    allowedHosts: ['localhost'], 
  },

});
