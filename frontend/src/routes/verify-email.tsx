import { EmailVerify } from '@/components/Common/EmailVerify';
import { createFileRoute } from '@tanstack/react-router';

type VerifyEmailSearch = {
  token?: string;
};

export const Route = createFileRoute('/verify-email')({
  validateSearch: (search: Record<string, unknown>): VerifyEmailSearch => ({
    token: search.token as string | undefined,
  }),
  component: EmailVerify,
});
