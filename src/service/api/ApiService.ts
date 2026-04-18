import { Tag } from '@/core/types/loggerTags';
import { getBaseUrl } from '@/utils/env';
import { ApiConst } from '@/utils/Constants';
import logger from '@/utils/logger';
import networkService from '@/utils/network';
import axios, { AxiosError } from 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipSessionOutHandling?: boolean;
  }
}

// Axios instance managing baseURL — used across all API calls
const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
});

// Network Interceptor
axiosInstance.interceptors.request.use(
  config => {
    if (!networkService.getConnectionStatus()) {
      return Promise.reject({
        code: '401',
        message: ApiConst.noInternetConnection,
      });
    }
    logger.log(Tag.API, '🔍 Final Axios Request Config:', {
      method: config.method,
      url: config.baseURL + '' + config.url,
      headers: config.headers,
      params: config.params,
      data: config.data,
    });
    return config;
  },
  error => {
    logger.log(Tag.API, 'error in network interceptor', JSON.stringify(error));
    return Promise.reject(error);
  },
);

/*
 Encryption Interceptor — uncomment and implement when needed
axiosInstance.interceptors.request.use(
  async config => { ... },
  error => Promise.reject(error),
);
*/

/*
 SessionOut Interceptor — uncomment and implement when needed
axiosInstance.interceptors.response.use(
  config => { ... },
  error => Promise.reject(error),
);
*/

/*
 Decryption Interceptor — uncomment and implement when needed
axiosInstance.interceptors.response.use(
  async config => { ... },
  error => Promise.reject(error),
);
*/

export function ApiService<T, R>(
  requestData: T,
  endPoint: string,
  method: string,
  params?: any,
): Promise<R> {
  const apiData = new Promise<R>((resolve, reject) => {
    axiosInstance
      .request<R>({
        url: endPoint,
        method: method,
        ...(method.toLowerCase() === 'get' ? { params: params } : { data: requestData }),
      })
      .then(response => {
        logger.log(Tag.API, 'Response', JSON.stringify(response.data));
        if (response.status === 200) {
          resolve(response.data as R);
        } else {
          reject(response.data as R);
        }
      })
      .catch(error => {
        logger.log(Tag.API, 'Error in api calling', JSON.stringify(error));
        reject({ code: 'axios_error', message: error?.message } as AxiosError);
      });
  });
  return apiData;
}

export default ApiService;
