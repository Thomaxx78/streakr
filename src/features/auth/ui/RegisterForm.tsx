import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import { RegisterSchema, type RegisterFormData } from '../model/authSchemas';
import { registerWithEmail } from '../api/authApi';
import { Button, Input } from '@/shared/ui';
import styles from './AuthForm.module.css';

export const RegisterForm = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setServerError(null);
      const { confirmPassword: _, ...credentials } = data;
      void _;
      await registerWithEmail(credentials);
      navigate('/dashboard');
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Erreur lors de l'inscription"
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Inscription</h1>
          <p className={styles.subtitle}>Prêt à streak ? <Rocket size={16} style={{ display: 'inline', verticalAlign: 'middle' }} /></p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Input
            label="Pseudo"
            placeholder="streak_master"
            error={errors.username?.message}
            {...register('username')}
          />

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

          <Input
            label="Confirmer le mot de passe"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          {serverError && (
            <div className={styles.serverError}>{serverError}</div>
          )}

          <Button type="submit" fullWidth size="lg" isLoading={isSubmitting}>
            Créer mon compte
          </Button>
        </form>

        <p className={styles.footer}>
          Déjà un compte ?{' '}
          <Link to="/login" className={styles.link}>
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};
