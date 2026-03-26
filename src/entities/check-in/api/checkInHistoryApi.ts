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

export async function fetchAllCheckIns(userId: string): Promise<CheckIn[]> {
  const { data, error } = await supabase
    .from('check_ins')
    .select('*')
    .eq('user_id', userId)
    .order('checked_at', { ascending: true });

  if (error) throw new Error(error.message);
  return CheckInListSchema.parse(data);
}

export async function fetchDateCheckIns(userId: string, date: string): Promise<CheckIn[]> {
  const { data, error } = await supabase
    .from('check_ins')
    .select('*')
    .eq('user_id', userId)
    .eq('checked_at', date);

  if (error) throw new Error(error.message);
  return CheckInListSchema.parse(data);
}
