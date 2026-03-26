import { z } from 'zod';
import { supabase } from '@/shared/config';
import type { Habit } from '@/entities/habit';

const CheckInDateSchema = z.array(z.object({ checked_at: z.string() }));

export interface HabitStats {
  totalCheckIns: number;
  last30DaysRate: number;
  bestStreak: number;
  currentStreak: number;
}

export async function fetchHabitStats(habit: Habit): Promise<HabitStats> {
  const { data, error } = await supabase
    .from('check_ins')
    .select('checked_at')
    .eq('habit_id', habit.id)
    .order('checked_at', { ascending: true });

  if (error) throw new Error(error.message);
  const rows = CheckInDateSchema.parse(data);

  const dates = new Set(rows.map((r) => r.checked_at));
  const totalCheckIns = dates.size;

  // Last 30 days completion rate
  const today = new Date();
  let last30Count = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0] ?? '';
    if (dates.has(dateStr)) last30Count++;
  }

  let denominator = 30;
  if (habit.frequency_type === 'weekly') {
    // Expected check-ins in 30 days = (30/7) * frequency_count
    denominator = Math.round((30 / 7) * habit.frequency_count);
  }
  const last30DaysRate = Math.min(Math.round((last30Count / denominator) * 100), 100);

  // Best streak (consecutive days with check-in)
  const sortedDates = Array.from(dates).sort();
  let bestStreak = 0;
  let runningStreak = 0;

  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) {
      runningStreak = 1;
    } else {
      const prev = new Date(sortedDates[i - 1] ?? '');
      const curr = new Date(sortedDates[i] ?? '');
      const diffDays = Math.round((curr.getTime() - prev.getTime()) / 86400000);
      runningStreak = diffDays === 1 ? runningStreak + 1 : 1;
    }
    bestStreak = Math.max(bestStreak, runningStreak);
  }

  // Current streak (count backwards from today)
  let currentStreak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0] ?? '';
    if (dates.has(dateStr)) {
      currentStreak++;
    } else {
      break;
    }
  }

  return { totalCheckIns, last30DaysRate, bestStreak, currentStreak };
}
