import { createFileRoute } from '@tanstack/react-router';
import { Register } from '@/container/auth/Register';

export const Route = createFileRoute('/register')({
  component: Register,
});