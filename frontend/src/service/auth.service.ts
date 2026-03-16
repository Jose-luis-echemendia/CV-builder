import { OpenAPI } from '@/client/core/OpenAPI';
import { request } from '@/client/core/request';
import { RegisterFormData, RegisterResponse } from '@/schemas/auth/register.schema';

export const AuthApi = {
  register: (body: RegisterFormData) =>
    request<RegisterResponse>(OpenAPI, {
      method: 'POST',
      url: '/auth/register',
      body: body,
      mediaType: 'application/json',
    }),
};
