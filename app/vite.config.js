import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import manifestPlugin from '../core/server/manifestPlugin';
import { tokenPlugin } from '../core/server/authPlugin';
import { version } from '../package.json';
import useAppInfo from '../core/composables/useAppInfo';

process.env.VITE_LEVIATE_VERSION = version;

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
    ]
  },

  plugins: [
    vue(),
    svgLoader(),
    manifestPlugin('../template/project'),
    tokenPlugin(),
  ],

  server: {
    port: 8080,
    proxy: {
      '/service': {
        target: process.env.SERVICE_URL,
        headers: {
          'x-app-id': process.env.npm_package_name + ' (development)'
        },
        changeOrigin: true,
      },
    },
  },
});
