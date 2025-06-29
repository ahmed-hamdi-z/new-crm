import { defineConfig } from 'vite';
import react from "@vitejs/plugin-react";
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
        '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true, // Enable source maps for debugging
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react', 'react-router'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react', 'react-router'],
  },
  server: {
    proxy: {
      "/rpc": "http://localhost:5000",
    },
    host: true,
    port: 5173,
  },
});