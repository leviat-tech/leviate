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
    },
  },

  build: {
    minify: true,
    rollupOptions: {
      input: './src/main.js',
      output: {
        name: 'plugin',
        format: 'iife',
        inlineDynamicImports: true, // iife build breaks without enabling this option
        entryFileNames: 'app.js',
      },
    },
  },

  optimizeDeps: {
    exclude: ['@headlessui/vue'],
    include: [
      '@crhio/leviate > axios',
    ],
  },

  plugins: [
    vue(),
    svgLoader(),
    createFetchProxyAccessTokenPlugin(),
    createVuePlugin(),
    JSDraftLoader(),
  ],

  server: {
    port: 8080,
  },
});
