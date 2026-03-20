import z from 'zod';

export const RegisterSchema = z
  .object({
    email: z.email('Correo electrónico inválido'),
    password: z
      .string()
      .min(12, 'La contraseña debe tener al menos 12 caracteres')
      .regex(
        /[A-Z]/,
        'La contraseña debe contener al menos una letra mayúscula'
      )
      .regex(
        /[a-z]/,
        'La contraseña debe contener al menos una letra minúscula'
      )
      .regex(
        /[^A-Za-z0-9]/,
        'La contraseña debe contener al menos un carácter especial'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof RegisterSchema>;

export interface RegisterResponse {
  message: string;
  user_id: string;
  email_verification_sent: boolean;
}
