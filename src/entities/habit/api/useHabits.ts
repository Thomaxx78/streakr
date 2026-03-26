import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchHabits, fetchArchivedHabits } from './habitApi';

export function useHabits(userId: string | undefined) {
  return useSuspenseQuery({
    queryKey: ['habits', userId],
    queryFn: () => {
      if (!userId) throw new Error('User not authenticated');
      return fetchHabits(userId);
    },
  });
}

export function useArchivedHabits(userId: string | undefined) {
  return useSuspenseQuery({
    queryKey: ['habits', 'archived', userId],
    queryFn: () => {
      if (!userId) throw new Error('User not authenticated');
      return fetchArchivedHabits(userId);
    },
  });
}
