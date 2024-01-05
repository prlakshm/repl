import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    base: '/repl/',
    build: {
      outDir: 'build',
    },
    plugins: [react()],
    server: {
      port: 8000,
    },
  };
});