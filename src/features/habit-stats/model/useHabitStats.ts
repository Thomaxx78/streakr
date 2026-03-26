import { useSuspenseQuery } from '@tanstack/react-query';
import type { Habit } from '@/entities/habit';
import { fetchHabitStats } from '../api/habitStatsApi';

export function useHabitStats(habit: Habit) {
  return useSuspenseQuery({
    queryKey: ['habit-stats', habit.id],
    queryFn: () => fetchHabitStats(habit),
  });
}
