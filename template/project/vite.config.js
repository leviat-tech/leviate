import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import { createFetchProxyAccessTokenPlugin } from '@crhio/leviate/server/fetch-access-token.js';
import 'dotenv/config';

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
    createFetchProxyAccessTokenPlugin(),
  ],

  server: {
    port: 8080,
  },
});
