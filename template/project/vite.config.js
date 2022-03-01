import path from 'path';
import { createVuePlugin } from 'vite-plugin-vue2';
import JSDraftLoader from '@crhio/rollup-plugin-jsdraft';
import { createSvgPlugin } from 'vite-plugin-vue2-svg';


const config = {
  resolve: {
    alias: {
      '@core': `${path.resolve(__dirname, '__core__')}`,
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
        entryFileNames: 'app.js',
      },
    },
  },

  plugins: [
    createVuePlugin({ jsx: true }),
    JSDraftLoader(),
    createSvgPlugin(),
  ],

  server: {
    port: 8080,
  },
};

export default config;
