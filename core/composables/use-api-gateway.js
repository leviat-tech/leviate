import axios from 'axios';

export const instance = axios.create({
  baseURL: '/api'
});

/**
 *
 * @param basePath
 * @return {{
 *   get: (path: string, [options: object]) => Promise<{data: object}>,
 *   put: (path: string, data: any, [options: object]) => Promise<{data: object}>,
 *   post: (path: string, data: any, [options: object]) => Promise<{data: object}>,
 *   delete: (path: string, [options: object]) => Promise<{data: object}>,
 * }}
 */
export function useApiGateway(basePath) {
  const SLASH_ENCODED = '%2F';
  const rxLeadingTrailingSlash = /^\/|\/$/g
  const methods = ['get', 'put', 'post', 'delete'];

  return methods.reduce((api, method) => {
    return {
      ...api,
      [method]: (...args) => {
        const specifyPath = (typeof args[0] === 'string');
        // Remove any leading and training slashes from the base path
        let fullPath = basePath.replace(rxLeadingTrailingSlash, '');
        let [data, options] = args;

        if (specifyPath) {
          // All slashes after the base path should be encoded in order for wildcard function app routes to work
          // Remove leading and training slashes from specified path and encode remaining slashes
          const specifiedPath = args[0].replace(rxLeadingTrailingSlash, '').replace(/\/+/g, SLASH_ENCODED);
          fullPath = [basePath, specifiedPath].join('/');

          data = args[1];
          options = args[2];
        }

        return instance[method](fullPath, data, options);
      }
    };
  }, {});
};