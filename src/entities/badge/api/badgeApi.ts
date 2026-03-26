import { supabase } from '@/shared/config';
import { BadgeListSchema, type BadgeType } from '../model/badgeSchema';
import type { Badge } from '../model/badgeSchema';

export async function fetchUserBadges(userId: string): Promise<Badge[]> {
  const { data, error } = await supabase
    .from('user_badges')
    .select('*')
    .eq('user_id', userId)
    .order('earned_at', { ascending: false });

  if (error) throw new Error(error.message);
  return BadgeListSchema.parse(data ?? []);
}

export async function awardBadge(userId: string, badgeType: BadgeType): Promise<void> {
  const { error } = await supabase
    .from('user_badges')
    .upsert(
      { user_id: userId, badge_type: badgeType },
      { onConflict: 'user_id,badge_type', ignoreDuplicates: true },
    );

  if (error) throw new Error(error.message);
}
