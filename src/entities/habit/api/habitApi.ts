import { supabase } from '@/shared/config';
import { HabitListSchema, type Habit } from '../model/habitSchema';

export async function fetchHabits(userId: string): Promise<Habit[]> {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .eq('is_archived', false)
    .order('position', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return HabitListSchema.parse(data);
}

export async function fetchArchivedHabits(userId: string): Promise<Habit[]> {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .eq('is_archived', true)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return HabitListSchema.parse(data);
}
