import { publicApi, privateApi } from '../../../shared/api/http';
import { tokenStore } from '../../../shared/api/token.store';
import type { LoginPayload, AuthResponse } from '../../auth/services/auth.types';

class AuthService {
  async login(payload: LoginPayload) {
    const { data } = await publicApi.post<AuthResponse>(
      '/auth/login',
      payload
    );

    tokenStore.set(data.accessToken);
    return data;
  }

  async register(payload: {
    email: string;
    password: string;
    name: string;
  }) {
    const { data } = await publicApi.post(
      "/auth/register",
      payload
    );

    return data;
  }

  verifyEmail(token: string) {
    return publicApi.get("/auth/verify", {
      params: { token },
    });
  }

  async logout() {
    await publicApi.post('/auth/logout');
    tokenStore.clear();
  }

  async refresh() {
    const { data } = await publicApi.post<AuthResponse>(
      '/auth/refresh'
    );

    tokenStore.set(data.accessToken);
    return data;
  }

  async getProfile() {
    const { data } = await privateApi.get('/auth/me');
    return data;
  }

  isAuthenticated() {
    return !!tokenStore.get();
  }
}

export const authService = new AuthService();