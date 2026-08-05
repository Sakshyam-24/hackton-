import api from '@/lib/api';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from '@/types';
import { STORAGE_KEYS } from '@/lib/constants';

class AuthService {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.login(data);
    this.setSession(response.token, response.user);
    return response;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.register(data);
    this.setSession(response.token, response.user);
    return response;
  }

  async getProfile(): Promise<User> {
    return api.getProfile() as Promise<User>;
  }

  async updateProfile(data: { name?: string; email?: string }): Promise<User> {
    const result = await api.updateProfile(data);
    if (result) {
      this.setSession(this.getToken()!, result);
    }
    return result;
  }

  logout(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USER);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private setSession(token: string, user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }
}

export const authService = new AuthService();
export default authService;
