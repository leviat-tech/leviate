import { useHost } from '../plugins/host';

class ApiGatewayRequestError extends Error {
  constructor(errorData) {
    super(errorData.message);

    const { status, code, message, data } = errorData;

    this.name = "ApiGatewayRequestError";
    this.code = code;
    this.status = status;
    this.message = message;
    this.data = data;
    this.toJSON = () => errorData;
  }
}

/**
 *
 * @param servicePath
 * @return {{
 *   get: (path: string, [options: object]) => Promise<{data: object}>,
 *   put: (path: string, data: any, [options: object]) => Promise<{data: object}>,
 *   post: (path: string, data: any, [options: object]) => Promise<{data: object}>,
 *   delete: (path: string, [options: object]) => Promise<{data: object}>,
 * }}
 */
export function useApiGateway(servicePath) {
  const methods = ['get', 'put', 'post', 'delete'];

  return methods.reduce((api, method) => {
    return {
      ...api,
      [method]: async (...args) => {
        const specifyPath = (typeof args[0] === 'string');
        let fullPath = servicePath;
        let [data, options] = args;

        if (specifyPath) {
          const specifiedPath = args[0];
          fullPath = [servicePath, specifiedPath].join('/');

          data = args[1];
          options = args[2];
        }

        const rxDoubleSlash = /\/+/g
        const url = fullPath.replace(rxDoubleSlash, '/')
        const { makeApiGatewayRequest } = useHost();
        const res = await makeApiGatewayRequest({ method, url, data, options });

        if (res.isError) throw new ApiGatewayRequestError(res);

        return res;
      }
    };
  }, {});
}
