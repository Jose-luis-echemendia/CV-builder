import { AuthApi } from '@/service/auth.service';
import { useMutation } from '@tanstack/react-query';
import useCustomToast from '../useCustomToast';
import { ApiError } from '@/client/core/ApiError';
import { handleError } from '@/utils';

export const useRegisterMutation = () => {
  const { register } = AuthApi;
  const { showSuccessToast } = useCustomToast();

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      showSuccessToast('User created successfully.');
    },
    onError: (error: ApiError) => {
      handleError(error);
    },
  });

  return mutation;
};
