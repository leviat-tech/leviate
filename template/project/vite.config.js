import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';


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
    vue(),
    svgLoader(),
  ],

  server: {
    port: 8080,
  },
});
