import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import packageJSON from './package';
import getDefaultTemplateCompilerOptions from '@crhio/leviate/server/defaultTemplateCompilerOptions.js'

import 'dotenv/config';
import manifestPlugin from '@crhio/leviate/server/manifestPlugin.js';

process.env.VITE_APP_VERSION = packageJSON.version;


export default defineConfig(({ mode }) => ({
  resolve: {
    alias: {
      '~': `${path.resolve(__dirname)}`,
      '@': `${path.resolve(__dirname, 'src')}`,
      '@crhio/leviate': '/node_modules/@crhio/leviate/core',
    },
  },

  base: `/plugins/${packageJSON.name}`,

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
    manifestPlugin(),
  ],

  server: {
    port: 8082,
    proxy: {
      '/api': {
        target: process.env.SERVICE_URL,
        headers: {
          'x-service-key': process.env.SERVICE_KEY,
        },
        changeOrigin: true,
      },
    },
  },

  preview: {
    port: 8081,
  },
}));
