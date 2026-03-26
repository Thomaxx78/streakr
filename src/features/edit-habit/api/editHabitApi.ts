import { supabase } from '@/shared/config';
import { HabitSchema, type Habit } from '@/entities/habit';
import type { EditHabitFormData } from '../model/editHabitSchema';

export async function updateHabit(
  habitId: string,
  data: EditHabitFormData,
): Promise<Habit> {
  const { data: row, error } = await supabase
    .from('habits')
    .update(data)
    .eq('id', habitId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return HabitSchema.parse(row);
}

export async function deleteHabit(habitId: string): Promise<void> {
  const { error } = await supabase.from('habits').delete().eq('id', habitId);
  if (error) throw new Error(error.message);
}

export async function archiveHabit(habitId: string): Promise<void> {
  const { error } = await supabase
    .from('habits')
    .update({ is_archived: true })
    .eq('id', habitId);
  if (error) throw new Error(error.message);
}

export async function restoreHabit(habitId: string): Promise<void> {
  const { error } = await supabase
    .from('habits')
    .update({ is_archived: false })
    .eq('id', habitId);
  if (error) throw new Error(error.message);
}
