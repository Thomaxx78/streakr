import { supabase } from '@/shared/config';
import { CheckInListSchema, type CheckIn } from '../model/checkInSchema';

export async function fetchCheckInHistory(
  userId: string,
  startDate: string,
  endDate: string,
): Promise<CheckIn[]> {
  const { data, error } = await supabase
    .from('check_ins')
    .select('*')
    .eq('user_id', userId)
    .gte('checked_at', startDate)
    .lte('checked_at', endDate)
    .order('checked_at', { ascending: true });

  if (error) throw new Error(error.message);
  return CheckInListSchema.parse(data);
}
