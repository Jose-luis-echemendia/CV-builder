import z from 'zod';

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export type LoginFormData = z.infer<typeof LoginSchema>;

export interface LoginResponse {
  token: string;
  user_id: string;
}