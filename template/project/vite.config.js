import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import 'dotenv/config';

const PRODUCTION_MODE = 'production'

export function removeDataTestAttrs(node) {
  const htmlNodeTypes = {
    element: 1,
    attribute: 6
  };

  const attributesToRemove = ['data-cy', ':data-cy'];

  const isElement = node.type === htmlNodeTypes.element;

  if (isElement) {
    node.props = node.props.filter(function (prop) {
      const isAttribute = prop.type === htmlNodeTypes.attribute;

      if (isAttribute) {
        const attributeName = prop.name;
        return !attributesToRemove.includes(attributeName);
      }

      const isDynamicAttribute = prop.name === 'bind';

      if (isDynamicAttribute) {
        const attributeName = prop.arg?.content;
        return !attributesToRemove.includes(attributeName);
      }

      return true;
    });
  }
}

export function getDataCyTemplateOptions(mode) {
  return {
    compilerOptions: {
      nodeTransforms: mode === PRODUCTION_MODE ? [removeDataTestAttrs] : [],
    },
  }
}

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
    vue({ template: getDataCyTemplateOptions(mode) }),
    svgLoader(),
  ],

  server: {
    port: 8080,
  },

  preview: {
    port: 8081,
  },
}));
