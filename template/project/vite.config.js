import path from 'path';
import { createVuePlugin } from 'vite-plugin-vue2';
import JSDraftLoader from '@crhio/rollup-plugin-jsdraft';
import { createSvgPlugin } from 'vite-plugin-vue2-svg';
import { createFetchProxyAccessTokenPlugin } from '@crhio/@crhio/leviate/server/fetch-access-token.js';
import 'dotenv/config';

const config = {
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

  // eliminate the need to explicitly import stylesheets in vue components
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@crhio/leviate/core/assets/styles/variables.scss";
          @import "@crhio/leviate/core/assets/styles/mixins.scss";
        `,
      },
    },
  },

  plugins: [
    createFetchProxyAccessTokenPlugin(),
    createVuePlugin(),
    JSDraftLoader(),
    createSvgPlugin(),
  ],

  server: {
    port: 8080,
  },
};

export default config;
