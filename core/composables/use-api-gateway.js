import axios from 'axios';
import { useHost } from '../plugins/host';

export const instance = axios.create({
  baseURL: '/api/service'
});

/**
 *
 * @param serviceName
 * @return {{
 *   get: (path: string, [options: object]) => Promise<{data: object}>,
 *   put: (path: string, data: any, [options: object]) => Promise<{data: object}>,
 *   post: (path: string, data: any, [options: object]) => Promise<{data: object}>,
 *   delete: (path: string, [options: object]) => Promise<{data: object}>,
 * }}
 */
export function useApiGateway(serviceName) {
  const { makeApiGatewayRequest } = useHost();

  const basePath = `/service/${serviceName}`;

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
          // Remove leading and training slashes from specified path and encode remaining slashes
          const specifiedPath = args[0]//.replace(rxLeadingTrailingSlash, '');
          fullPath = [basePath, specifiedPath].join('/');

          data = args[1];
          options = args[2];
        }

        return makeApiGatewayRequest({ method, url: fullPath, data, options });
      }
    };
  }, {});
};

const api = useApiGateway('spa-calc');
const res = await api.post('/route', data)
const res2 = await api.post(data);