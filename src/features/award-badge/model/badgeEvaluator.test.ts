import { describe, it, expect } from 'vitest';
import { evaluateNewBadges } from './badgeEvaluator';
import type { CheckIn } from '@/entities/check-in';
import type { Habit } from '@/entities/habit';
import type { Badge } from '@/entities/badge';

const makeHabit = (id: string): Habit => ({
  id,
  user_id: 'user-1',
  name: 'Test',
  description: null,
  category: 'general',
  icon: '🎯',
  color: '#FF6B35',
  xp_per_check: 10,
  is_archived: false,
  created_at: '2024-01-01',
  frequency_type: 'daily',
  frequency_count: 1,
  position: null,
});

const makeCheckIn = (habitId: string, date: string): CheckIn => ({
  id: crypto.randomUUID(),
  habit_id: habitId,
  user_id: 'user-1',
  checked_at: date,
  created_at: date,
});

describe('evaluateNewBadges', () => {
  it('attribue first_checkin au premier check-in', () => {
    const checkIns = [makeCheckIn('h1', '2024-01-01')];
    const habits = [makeHabit('h1')];
    const result = evaluateNewBadges(checkIns, habits, []);
    expect(result).toContain('first_checkin');
  });

  it("n'attribue pas first_checkin si déjà obtenu", () => {
    const existingBadge: Badge = {
      id: crypto.randomUUID(),
      user_id: 'user-1',
      badge_type: 'first_checkin',
      earned_at: '2024-01-01',
    };
    const checkIns = [makeCheckIn('h1', '2024-01-01')];
    const habits = [makeHabit('h1')];
    const result = evaluateNewBadges(checkIns, habits, [existingBadge]);
    expect(result).not.toContain('first_checkin');
  });

  it('attribue habits_5 quand 5 habitudes actives', () => {
    const habits = ['h1', 'h2', 'h3', 'h4', 'h5'].map(makeHabit);
    const result = evaluateNewBadges([], habits, []);
    expect(result).toContain('habits_5');
  });

  it("n'attribue pas habits_5 avec moins de 5 habitudes", () => {
    const habits = ['h1', 'h2', 'h3'].map(makeHabit);
    const result = evaluateNewBadges([], habits, []);
    expect(result).not.toContain('habits_5');
  });

  it('attribue checkins_50 à 50 check-ins', () => {
    const checkIns = Array.from({ length: 50 }, (_, i) =>
      makeCheckIn('h1', `2024-${String(Math.floor(i / 30) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`),
    );
    const habits = [makeHabit('h1')];
    const result = evaluateNewBadges(checkIns, habits, []);
    expect(result).toContain('checkins_50');
  });

  it('retourne un tableau vide sans check-in ni habitude', () => {
    const result = evaluateNewBadges([], [], []);
    expect(result).toHaveLength(0);
  });
});
