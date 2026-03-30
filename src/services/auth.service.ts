import { AxiosResponse } from 'axios';
import { ApiClient } from './api-client';
import { AuthRequest, AuthResponse } from '../models/auth.model';
import { config } from '../utils/config';

export class AuthService extends ApiClient {
  async createToken(
    // If I don't pass credentials manually, these come from config/env values.
    username: string = config.adminUsername,
    password: string = config.adminPassword
  ): Promise<AxiosResponse<AuthResponse>> {
    const payload: AuthRequest = { username, password };
    return this.post<AuthResponse, AuthRequest>('/auth', payload);
  }
}
