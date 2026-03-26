import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchUserProfile } from './userApi';

export function useUserProfile(userId: string | undefined) {
  return useSuspenseQuery({
    queryKey: ['user-profile', userId],
    queryFn: () => {
      if (!userId) throw new Error('User not authenticated');
      return fetchUserProfile(userId);
    },
  });
}
