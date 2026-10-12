import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' pra funcionar no GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: './',
});
