import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import manifestPlugin from '../core/server/manifestPlugin';

export default defineConfig({
  resolve: {
    alias: {
      '~': `${path.resolve(__dirname, '../template/project')}`,
      '@': `${path.resolve(__dirname, '../template/project/src')}`,
      '@crhio/leviate': `${path.resolve(__dirname, '../core')}`,
    },
  },

  build: {
    minify: true,
    rollupOptions: {
      input: 'entry.js',
      output: {
        name: 'plugin',
        format: 'iife',
        inlineDynamicImports: true, // iife build breaks without enabling this option
        entryFileNames: 'app.js',
        dir: '../documentation/docs/.vuepress/dist'
      },
    },
  },

  optimizeDeps: {
    exclude: [
      '@headlessui/vue',
      // '@crhio/concrete',
      // '@crhio/leviate',
      // 'pinia',
      // 'vue',
      // 'vue-router',
    ],
    include: [
      '@crhio/leviate > axios',
      'axios/lib/adapters/http',
    ],
  },

  plugins: [
    vue(),
    svgLoader(),
    manifestPlugin('../template/project'),
  ],

  server: {
    port: 8080,
  },
});
