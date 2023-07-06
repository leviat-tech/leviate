import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import 'dotenv/config';
import manifestPlugin from '@crhio/leviate/server/manifestPlugin.js';


export default defineConfig({
  resolve: {
    alias: {
      '~': `${path.resolve(__dirname)}`,
      '@': `${path.resolve(__dirname, 'src')}`,
      '@crhio/leviate': '/node_modules/@crhio/leviate/core',
    },
  },

  optimizeDeps: {
    exclude: [
      '@headlessui/vue',
      '@crhio/leviate',
      '@crhio/normie',
      'pinia',
      'vue-router',
      'vue',
    ],
    include: [
      '@crhio/leviate > axios',
      'axios/lib/adapters/http',
    ],
  },

  plugins: [
    vue(),
    svgLoader(),
    manifestPlugin(),
  ],

  server: {
    port: 8080,
  },

  preview: {
    port: 8081,
  },
});
