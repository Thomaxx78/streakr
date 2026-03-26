import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchCheckInHistory } from './checkInHistoryApi';

export function useCheckInHistory(
  userId: string | undefined,
  startDate: string,
  endDate: string,
) {
  return useSuspenseQuery({
    queryKey: ['check-ins', 'history', userId, startDate, endDate],
    queryFn: () => {
      if (!userId) throw new Error('User not authenticated');
      return fetchCheckInHistory(userId, startDate, endDate);
    },
  });
}
