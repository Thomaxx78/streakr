import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchUserBadges } from '../api/badgeApi';

export function useBadges(userId: string | undefined) {
  return useSuspenseQuery({
    queryKey: ['badges', userId],
    queryFn: () => {
      if (!userId) return [];
      return fetchUserBadges(userId);
    },
    staleTime: 1000 * 60 * 5,
  });
}
