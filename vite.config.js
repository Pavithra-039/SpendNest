import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 3000,
    host: true
  }
});
