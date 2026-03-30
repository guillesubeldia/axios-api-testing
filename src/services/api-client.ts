import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { config } from '../utils/config';

export class ApiClient {
  protected client: AxiosInstance;

  constructor(token?: string) {
    // I clone base headers from config to keep request defaults in one place.
    const headers: Record<string, string> = { ...config.headers };

    if (token) {
      // This API expects auth in a Cookie header, not in Authorization Bearer.
      headers['Cookie'] = `token=${token}`;
    }

    this.client = axios.create({
      // baseURL comes from config.ts, which reads from env (or fallback values).
      baseURL: config.baseUrl,
      headers,
      timeout: 10000,
    });
  }

  protected async get<T>(path: string, params?: Record<string, string>): Promise<AxiosResponse<T>> {
    return this.client.get<T>(path, { params });
  }

  protected async post<T, D>(path: string, data: D): Promise<AxiosResponse<T>> {
    return this.client.post<T>(path, data);
  }

  protected async put<T, D>(path: string, data: D): Promise<AxiosResponse<T>> {
    return this.client.put<T>(path, data);
  }

  protected async patch<T, D>(path: string, data: Partial<D>): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(path, data);
  }

  protected async delete<T>(path: string): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(path);
  }
}
