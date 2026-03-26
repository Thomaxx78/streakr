import { useSuspenseQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth';
import { fetchCheckInHistory } from './checkInHistoryApi';

export function useCheckInHistory(startDate: string, endDate: string) {
  const userId = useAuthStore((s) => s.user?.id);

  return useSuspenseQuery({
    queryKey: ['check-ins', 'history', userId, startDate, endDate],
    queryFn: () => {
      if (!userId) throw new Error('User not authenticated');
      return fetchCheckInHistory(userId, startDate, endDate);
    },
  });
}
