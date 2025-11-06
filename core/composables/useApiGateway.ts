import { v4 as uuidv4 } from 'uuid';
import { TokenResponse } from '../types'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useHost } from '../plugins/host';
import { getLoggerPayload, type LogLevel } from './useLoggerApi';

interface ApiGatewayErrorData {
  status: number;
  code: string;
  message: string;
  data: any;
  isError?: boolean;
}

let currentToken: string | undefined;
let currentTokenExpiresAt = 0;

class ApiGatewayRequestError extends Error {
  code: string;
  status: number;
  message: string;
  data: any;
  toJSON: () => ApiGatewayErrorData

  constructor(errorData: ApiGatewayErrorData) {
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

async function fetchToken(nowSeconds: number) {
  const { fetchServiceToken } = useHost();
  const { access_token, expires_in } = await fetchServiceToken() as TokenResponse;

  if (!access_token) {
    throw new Error('could not retrieve access token');
  }

  currentToken = access_token;
  currentTokenExpiresAt = nowSeconds + expires_in;

  return currentToken;
}

async function getToken(): Promise<string | undefined> {
  const nowSeconds = Math.floor(Date.now() / 1000);

  if (!currentToken) {
    return fetchToken(nowSeconds);
  }

  const timeInSecondsUntilExpiry = currentTokenExpiresAt - nowSeconds;
  const isExpired = timeInSecondsUntilExpiry <= 0;

  if (isExpired) {
    return fetchToken(nowSeconds);
  }

  const refreshWindowSeconds = 120;
  const minimumBackgroundRefreshSeconds = 20;

  if (
    timeInSecondsUntilExpiry < refreshWindowSeconds &&
    timeInSecondsUntilExpiry > minimumBackgroundRefreshSeconds
  ) {
      // If token needs refreshing soon then fetch a new one in the background
    // and use the current token for the request;
    fetchToken(nowSeconds);
  }

  return currentToken;
}

export interface ApiGateway {
  get: <T = any>(path: string, options?: AxiosRequestConfig) => Promise<T>;
  put: <T = any>(path: string | object, data?: any, options?: AxiosRequestConfig) => Promise<T>;
  post: <T = any>(path: string | object, data?: any, options?: AxiosRequestConfig) => Promise<T>;
  delete: <T = any>(path: string, options?: AxiosRequestConfig) => Promise<T>;
}

function getSanitizedData(unsanitizedData: any): any | undefined {
  // Data is not preset e.g. GET request
  if (!unsanitizedData) return undefined;

  // Don't sanitize formdata
  if (unsanitizedData instanceof FormData) return unsanitizedData;

  // Cast data to a POJO (strip functions and circular references etc)
  return JSON.parse(JSON.stringify(unsanitizedData));
}

function logRequest(
  transactionId: string,
  headers: Record<string, string>,
  level: LogLevel,
  message: string,
  data?: any
) {
  const payload = getLoggerPayload(level, message, transactionId, data);

  return axios.post('/service/logger', payload, { headers });
}

export function useApiGateway(servicePath: string): ApiGateway {
  const methods: (keyof ApiGateway)[] = ['get', 'put', 'post', 'delete'];

  return methods.reduce((api, method) => {
    return {
      ...api,
      [method]: async <T = any>(...args: any[]): Promise<T> => {
        const specifyPath = typeof args[0] === 'string';
        let fullPath = servicePath;
        let unsanitizedData: any;
        let options: AxiosRequestConfig | undefined;

        if (specifyPath) {
          const specifiedPath = args[0] as string;
          fullPath = [servicePath, specifiedPath].join('/');

          unsanitizedData = args[1];
          options = args[2];
        } else {
          unsanitizedData = args[0];
          options = args[1];
        }

        const data = getSanitizedData(unsanitizedData);
        const rxDoubleSlash = /\/+/g;
        const url = '/service/' + fullPath.replace(rxDoubleSlash, '/');
        const pluginId = await useHost().meta.configurator.referenceName;

        const token = await getToken();
        const headers = {
          Authorization: `Bearer ${token}`,
          'x-app-id': pluginId
        };

        const transactionId = uuidv4();

        const shouldLog = (servicePath !== 'logger');

        shouldLog && logRequest(transactionId, headers, 'info', `Sending request to ${url}`, data);

        try {
          const res: AxiosResponse<T> = await axios({
            method,
            url,
            data,
            headers,
            ...options,
          });
          shouldLog && logRequest(transactionId, headers, 'info', `Request succeeded`);
          return res.data;
        } catch (e: any) {
          if (e.response) {
            const { status, statusText, data } = e.response;
            const errorData: ApiGatewayErrorData = {
              data,
              message: e.message,
              status,
              code: statusText,
            };

            shouldLog && logRequest(transactionId, headers, 'error', `Request failed`, errorData);

            throw new ApiGatewayRequestError(errorData);
          } else {
            throw e;
          }
        }
      },
    };
  }, {} as ApiGateway);
}
