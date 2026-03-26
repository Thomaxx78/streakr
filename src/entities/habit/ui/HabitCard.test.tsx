import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HabitCard } from './HabitCard';
import type { Habit } from '../model/habitSchema';

const mockHabit: Habit = {
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

describe('HabitCard', () => {
  it('devrait afficher le nom et l\'icône de l\'habitude', () => {
    render(<HabitCard habit={mockHabit} />);
    expect(screen.getByText('Méditation')).toBeInTheDocument();
    expect(screen.getByText('🧘')).toBeInTheDocument();
  });

  it('devrait afficher la catégorie en badge', () => {
    render(<HabitCard habit={mockHabit} />);
    expect(screen.getByText('santé')).toBeInTheDocument();
  });

  it('devrait rendre le slot actions', () => {
    render(
      <HabitCard habit={mockHabit} actions={<button>Action</button>} />,
    );
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });
});
