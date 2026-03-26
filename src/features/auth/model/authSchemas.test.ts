import { describe, it, expect } from 'vitest';
import { RegisterSchema } from './authSchemas';

const validData = {
  username: 'streakmaster',
  email: 'test@example.com',
  password: 'Secure123',
  confirmPassword: 'Secure123',
};

describe('RegisterSchema', () => {
  it('devrait accepter des données d\'inscription valides', () => {
    const result = RegisterSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('devrait rejeter si les mots de passe ne correspondent pas', () => {
    const result = RegisterSchema.safeParse({
      ...validData,
      confirmPassword: 'Autremotdepasse1',
    });
    expect(result.success).toBe(false);
  });

  it('devrait rejeter un email invalide', () => {
    const result = RegisterSchema.safeParse({
      ...validData,
      email: 'pas-un-email',
    });
    expect(result.success).toBe(false);
  });

  it('devrait rejeter un mot de passe sans majuscule', () => {
    const result = RegisterSchema.safeParse({
      ...validData,
      password: 'secure123',
      confirmPassword: 'secure123',
    });
    expect(result.success).toBe(false);
  });
});
