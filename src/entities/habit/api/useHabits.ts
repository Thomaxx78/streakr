import { useSuspenseQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth';
import { fetchHabits, fetchArchivedHabits } from './habitApi';

export function useHabits() {
  const userId = useAuthStore((s) => s.user?.id);

  return useSuspenseQuery({
    queryKey: ['habits', userId],
    queryFn: () => {
      if (!userId) throw new Error('User not authenticated');
      return fetchHabits(userId);
    },
  });
}

export function useArchivedHabits() {
  const userId = useAuthStore((s) => s.user?.id);

  return useSuspenseQuery({
    queryKey: ['habits', 'archived', userId],
    queryFn: () => {
      if (!userId) throw new Error('User not authenticated');
      return fetchArchivedHabits(userId);
    },
  });
}
