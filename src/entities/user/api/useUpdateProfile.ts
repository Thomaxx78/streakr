import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserProfile } from './userApi';
import type { UserProfile } from '../model/userSchema';

export function useUpdateProfile(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: Partial<Pick<UserProfile, 'username' | 'avatar_url' | 'active_title'>>,
    ) => {
      if (!userId) throw new Error('User not authenticated');
      return updateUserProfile(userId, data);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['user-profile', userId] });
    },
  });
}
