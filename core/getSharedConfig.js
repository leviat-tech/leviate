const path = require('path');
const merge = require('lodash/merge');
const vue = require('@vitejs/plugin-vue');
const svgLoader = require('vite-svg-loader');
const getDefaultTemplateCompilerOptions = require('./server/defaultTemplateCompilerOptions');
const manifestPlugin = require('./server/manifestPlugin');
const authPlugin = require('./server/authPlugin');
const translationPlugin = require('./server/translation');

/**
 * Ensure page does a full reload when 3d files are updated
 * as hot uploading not currently supported
 * @return {{handleHotUpdate(*): void, name: string}}
 */
const threeReloadPlugin = () => ({
  name: 'three-reload',
  handleHotUpdate(ctx) {
    if (ctx.file.search('3dmodel') > -1) {
      ctx.server.ws.send({ type: 'full-reload' });
    }
  },
});

module.exports = function getSharedConfig({ mode, projectConfig = {} }) {
  const sharedConfig = {
    resolve: {
      alias: {
        '~': `${path.resolve(process.cwd())}`,
        '@': `${path.resolve(process.cwd(), 'src')}`,
        '@crhio/leviate': '/node_modules/@crhio/leviate/core',
      },
    },

    base: './',

    optimizeDeps: {
      exclude: ['@headlessui/vue', '@crhio/leviate', '@crhio/normie', 'pinia', 'vue-router', 'vue'],
      include: ['@crhio/leviate > axios', 'axios/lib/adapters/http'],
    },

    plugins: [
      svgLoader(),
      authPlugin(),
      manifestPlugin(),
      threeReloadPlugin(),
      vue(getDefaultTemplateCompilerOptions(mode)),
      translationPlugin()
    ],

    build: {
      minify: false,
    },

    server: {
      port: 8080,
      proxy: {
        '/service': {
          target: process.env.SERVICE_URL,
          rewrite: (path) => {
            return process.env.SERVICE_URL.includes('leviatdesignstudio.com')
              ? path
              : path.replace('/api/service', '')
          },
          headers: {
            'x-app-id': process.env.npm_package_name + ' (development)'
          },
          changeOrigin: true,
        },
      },
    },

    preview: {
      port: 8081,
    },

    test: {
      globals: true,
    },
  }

  return merge(sharedConfig, projectConfig)
}
