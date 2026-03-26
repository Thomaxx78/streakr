import { supabase } from '@/shared/config';

export async function createCheckIn(habitId: string, date: string): Promise<void> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError ?? !user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('check_ins')
    .upsert(
      { habit_id: habitId, user_id: user.id, checked_at: date },
      { onConflict: 'habit_id,checked_at', ignoreDuplicates: true },
    );

  if (error) throw new Error(error.message);
}
