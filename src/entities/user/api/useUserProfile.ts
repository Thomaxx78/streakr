import { useSuspenseQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth';
import { fetchUserProfile } from './userApi';

export function useUserProfile() {
  const userId = useAuthStore((s) => s.user?.id);

  return useSuspenseQuery({
    queryKey: ['user-profile', userId],
    queryFn: () => {
      if (!userId) throw new Error('User not authenticated');
      return fetchUserProfile(userId);
    },
  });
}
