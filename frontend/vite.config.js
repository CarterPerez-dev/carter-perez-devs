import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer'; 

export default defineConfig({
  plugins: [
    react({
      include: '**/*.{jsx,js}',
      babel: {
        plugins: [
          ['transform-remove-console', { exclude: ['error', 'warn'] }] 
        ]
      }
    }),
    visualizer({ 
      filename: 'stats.html',
      open: false,
      gzipSize: true
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'), 
    },
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      output: {
        comments: false
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          framework: ['framer-motion', 'three', '@react-three/fiber', '@react-three/drei'],
          utils: ['gsap', 'phosphor-react', 'react-icons'],
        },
      },
      cssCodeSplit: true,
    },
    sourcemap: true,
    chunkSizeWarningLimit: 800,
    cssMinify: true,
    assetsInlineLimit: 4096,
  },
  experimental: {
    renderBuiltUrl(filename) {
      if (filename.endsWith('.js')) {
        return { type: 'script', attrs: { defer: true } };
      }
      if (filename.endsWith('.css')) {
        return { type: 'style' };
      }
      return {};
    }
  }
});
