import useAuthStore from '@/stores/useAuthStore';
import { OpenAPI } from '../client/core/OpenAPI';

export function setupApi() {
  const { token } = useAuthStore.getState();

  OpenAPI.interceptors.request.use((config) => {
    const apiKey = import.meta.env.VITE_API_KEY;

    config.headers = {
      ...config.headers,
      'X-API-Key': apiKey,
      'Authorization': token ? `Bearer ${token}` : undefined,
    };

    return config;
  });

  if (import.meta.env.DEV) {
    OpenAPI.interceptors.response.use((response) => {
      console.debug(`[API] ${response.status} ${response.config?.url}`);
      return response;
    });
  }
}
