import z from 'zod';

export const RegisterSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(12, 'Password must be at least 12 characters'),
});

export type RegisterFormData = z.infer<typeof RegisterSchema>;

export interface RegisterResponse {
  message: string;
  user_id: string;
  email_verification_sent: boolean;
}
