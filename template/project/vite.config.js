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
      '@crhio/leviate': `${path.resolve(__dirname, '../../core')}`,
    },
  },

  build: {
    minify: true,
    rollupOptions: {
      input: '/node_modules/@crhio/leviate/core/entry-dev.js',
      output: {
        name: 'plugin',
        format: 'iife',
        inlineDynamicImports: true, // iife build breaks without enabling this option
        entryFileNames: 'app.js',
      },
    },
  },

  optimizeDeps: {
    exclude: [
      '@headlessui/vue',
      '@crhio/leviate',
      // 'pinia',
      // 'vue-router',
      // 'vue',
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
