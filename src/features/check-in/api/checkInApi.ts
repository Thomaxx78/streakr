import { supabase } from '@/shared/config';
import { CheckInListSchema, type CheckIn } from '@/entities/check-in';

export async function fetchTodayCheckIns(userId: string): Promise<CheckIn[]> {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('check_ins')
    .select('*')
    .eq('user_id', userId)
    .eq('checked_at', today);

  if (error) throw new Error(error.message);
  return CheckInListSchema.parse(data);
}

export async function fetchRecentCheckIns(userId: string, days = 30): Promise<CheckIn[]> {
  const from = new Date();
  from.setDate(from.getDate() - days);
  const fromStr = from.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('check_ins')
    .select('*')
    .eq('user_id', userId)
    .gte('checked_at', fromStr)
    .order('checked_at', { ascending: false });

  if (error) throw new Error(error.message);
  return CheckInListSchema.parse(data);
}

export async function toggleCheckIn(habitId: string, date: string): Promise<void> {
  const { data: existing, error: fetchError } = await supabase
    .from('check_ins')
    .select('id')
    .eq('habit_id', habitId)
    .eq('checked_at', date)
    .maybeSingle();

  if (fetchError) throw new Error(fetchError.message);

  if (existing) {
    const { error } = await supabase.from('check_ins').delete().eq('id', existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('check_ins')
      .insert({ habit_id: habitId, user_id: user.id, checked_at: date });

    if (error) throw new Error(error.message);
  }
}
