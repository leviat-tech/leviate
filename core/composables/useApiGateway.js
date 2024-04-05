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
 * @param servicePath
 * @return {{
 *   get: (path: string, options?: object) => Promise<*>,
 *   put: (pathOrData: string | object, dataOrOptions: any, object?: options) => Promise<*>,
 *   post: (pathOrData: string | object, dataOrOptions: any, object?: options) => Promise<*>,
 *   delete: (path: string, options: object) => Promise<*>,
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
        let [unsanitizedData, options] = args;

        if (specifyPath) {
          const specifiedPath = args[0];
          fullPath = [servicePath, specifiedPath].join('/');

          unsanitizedData = args[1];
          options = args[2];
        }

        // If req data contains Proxy objects then the postmessage handler will fail
        // Solve this by ensuring that data is a POJO before POSTing
        const data = unsanitizedData ? JSON.parse(JSON.stringify(unsanitizedData)) : undefined;
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
