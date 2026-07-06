/**
 * Thin verb wrapper around the shared axios instance — the mobile counterpart
 * of the web app's `CoreApi`. Query modules instantiate one per feature and
 * call `findAllGet` / `findAllPost` / … so they never touch axios directly.
 */
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { http } from './http';

export class CoreApi {
  constructor(public basePath: string = '') {}

  findAllGet<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return http.get<T>(url, config);
  }

  findAllPost<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return http.post<T>(url, data, config);
  }

  findAllPut<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return http.put<T>(url, data, config);
  }

  findAllPatch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return http.patch<T>(url, data, config);
  }

  findAllDelete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return http.delete<T>(url, config);
  }
}
