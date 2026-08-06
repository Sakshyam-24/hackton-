import apiClient, { ApiError } from '@/services/api';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ChatResponse,
} from '@/types';

class ApiFacade {
  private client = apiClient;

  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.client.post<AuthResponse>('/api/v1/auth/login', data);
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.client.post<AuthResponse>('/api/v1/auth/register', data);
  }

  async getProfile(): Promise<any> {
    return this.client.get('/api/v1/auth/profile');
  }

  async updateProfile(data: { name?: string; email?: string }): Promise<any> {
    return this.client.patch('/api/v1/auth/profile', data);
  }

  async sendMessage(data: { message: string; conversation_id?: string }): Promise<ChatResponse> {
    return this.client.post<ChatResponse>('/api/v1/chat', data);
  }
}

export const api = new ApiFacade();
export { ApiError };
export default api;
