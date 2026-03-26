import { describe, it, expect } from 'vitest';
import { HabitSchema } from './habitSchema';

const validHabit = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  user_id: '123e4567-e89b-12d3-a456-426614174001',
  name: 'Méditation',
  description: null,
  category: 'santé',
  icon: '🧘',
  color: '#4ECDC4',
  xp_per_check: 10,
  is_archived: false,
  created_at: '2024-01-01',
  frequency_type: 'daily',
  frequency_count: 1,
  position: null,
};

describe('HabitSchema', () => {
  it('devrait accepter une habitude valide', () => {
    const result = HabitSchema.safeParse(validHabit);
    expect(result.success).toBe(true);
  });

  it('devrait rejeter une habitude sans nom', () => {
    const result = HabitSchema.safeParse({ ...validHabit, name: '' });
    expect(result.success).toBe(false);
  });

  it('devrait rejeter un xp_per_check négatif', () => {
    const result = HabitSchema.safeParse({ ...validHabit, xp_per_check: -5 });
    expect(result.success).toBe(false);
  });
});
