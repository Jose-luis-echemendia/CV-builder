import { AuthApi } from '@/service/auth.service';
import { useMutation } from '@tanstack/react-query';
import { ApiError } from '@/client/core/ApiError';
import { handleError } from '@/utils';

export const useVerifyEmailMutation = () => {
  const mutation = useMutation({
    mutationFn: (token: string) => AuthApi.verifyEmail(token),
    onError: (error: ApiError) => {
      handleError(error);
    },
  });

  return mutation;
};
