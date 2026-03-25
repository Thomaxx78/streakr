import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { LoginSchema, type LoginFormData } from '../model/authSchemas';
import { loginWithEmail } from '../api/authApi';
import { Button, Input } from '@/shared/ui';
import styles from './AuthForm.module.css';

export const LoginForm = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setServerError(null);
      await loginWithEmail(data);
      navigate('/dashboard');
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Erreur de connexion'
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Connexion</h1>
          <p className={styles.subtitle}>Content de te revoir ! 🔥</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Input
            label="Email"
            type="email"
            placeholder="ton@email.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          {serverError && (
            <div className={styles.serverError}>{serverError}</div>
          )}

          <Button type="submit" fullWidth size="lg" isLoading={isSubmitting}>
            Se connecter
          </Button>
        </form>

        <p className={styles.footer}>
          Pas encore de compte ?{' '}
          <Link to="/register" className={styles.link}>
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
};
