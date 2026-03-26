import { fetchHabits } from '@/entities/habit';
import { fetchDateCheckIns } from '@/entities/check-in';
import type { Habit } from '@/entities/habit';

export function getYesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0] ?? '';
}

export async function fetchMissedHabitsYesterday(userId: string): Promise<Habit[]> {
  const yesterday = getYesterdayStr();
  const [habits, checkIns] = await Promise.all([
    fetchHabits(userId),
    fetchDateCheckIns(userId, yesterday),
  ]);

  const checkedIds = new Set(checkIns.map((ci) => ci.habit_id));
  return habits.filter((h) => h.frequency_type === 'daily' && !checkedIds.has(h.id));
}
