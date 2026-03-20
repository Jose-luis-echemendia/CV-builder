import { OpenAPI } from '@/client/core/OpenAPI';
import { request } from '@/client/core/request';
import { LoginFormData, LoginResponse } from '@/schemas/auth/login.schema';
import {
  RegisterFormData,
  RegisterResponse,
} from '@/schemas/auth/register.schema';

export const AuthApi = {
  register: (body: Omit<RegisterFormData, 'confirmPassword'>) =>
    request<RegisterResponse>(OpenAPI, {
      method: 'POST',
      url: '/auth/register',
      body: body,
      mediaType: 'application/json',
    }),
  login: (body: LoginFormData) =>
    request<LoginResponse>(OpenAPI, {
      method: 'POST',
      url: '/auth/login/access-token',
      body: body,
      mediaType: 'application/json',
    }),
  verifyEmail: (token: string) =>
    request<{ message: string }>(OpenAPI, {
      method: 'POST',
      url: '/auth/verify-email',
      body: { token },
      mediaType: 'application/json',
    }),
};
