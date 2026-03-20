import { ApiError } from '@/client/core/ApiError';

import { AuthApi } from '@/service/auth.service';
import useAuthStore from '@/stores/useAuthStore';
import { handleError } from '@/utils';
import { useMutation } from '@tanstack/react-query';

export const useLoginMutation = () => {
  const { login } = AuthApi;
  const { setToken } = useAuthStore.getState();
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setToken(data.token);
    },
    onError: (error: ApiError) => {
      handleError(error);
    },
  });

  return mutation;
};
