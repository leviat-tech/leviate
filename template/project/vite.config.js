import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import getDefaultTemplateCompilerOptions from '@crhio/leviate/server/defaultTemplateCompilerOptions.js'

import 'dotenv/config';

export default defineConfig(({ mode }) => ({
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
    vue(getDefaultTemplateCompilerOptions(mode)),
    svgLoader(),
  ],

  server: {
    port: 8080,
  },

  preview: {
    port: 8081,
  },
}));
