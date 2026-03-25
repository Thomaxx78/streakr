import { supabase } from '@/shared/config';
import { HabitSchema, type Habit } from '@/entities/habit';
import type { CreateHabitFormData } from '../model/createHabitSchema';

export async function createHabit(
  data: CreateHabitFormData,
  userId: string,
): Promise<Habit> {
  const { data: row, error } = await supabase
    .from('habits')
    .insert({ ...data, user_id: userId })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return HabitSchema.parse(row);
}
