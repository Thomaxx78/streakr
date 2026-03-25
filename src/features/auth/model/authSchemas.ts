import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(6, 'Le mot de passe doit faire au moins 6 caractères'),
});

export type LoginFormData = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  username: z
    .string()
    .min(3, 'Le pseudo doit faire au moins 3 caractères')
    .max(20, 'Le pseudo ne doit pas dépasser 20 caractères')
    .regex(/^[a-zA-Z0-9_]+$/, 'Uniquement lettres, chiffres et underscores'),
  email: z.string().email('Adresse email invalide'),
  password: z
    .string()
    .min(6, 'Le mot de passe doit faire au moins 6 caractères')
    .regex(/[A-Z]/, 'Doit contenir au moins une majuscule')
    .regex(/[0-9]/, 'Doit contenir au moins un chiffre'),
  confirmPassword: z.string(),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  }
);

export type RegisterFormData = z.infer<typeof RegisterSchema>;
