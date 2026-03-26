import { supabase } from '@/shared/config';
import { UserProfileSchema, type UserProfile } from '../model/userSchema';

export async function updateUserProfile(
  userId: string,
  data: Partial<Pick<UserProfile, 'username' | 'avatar_url' | 'active_title'>>,
): Promise<UserProfile> {
  const { data: updated, error } = await supabase
    .from('user_profiles')
    .update(data)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return UserProfileSchema.parse(updated);
}

export async function fetchUserProfile(userId: string): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw new Error(error.message);

  // Profil inexistant (inscription avant le trigger) → on le crée
  if (!data) {
    const { data: created, error: createError } = await supabase
      .from('user_profiles')
      .insert({ id: userId, username: 'Streaker' })
      .select()
      .single();

    if (createError) throw new Error(createError.message);
    return UserProfileSchema.parse(created);
  }

  return UserProfileSchema.parse(data);
}
