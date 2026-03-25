import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth';
import { fetchTodayCheckIns, toggleCheckIn } from '../api/checkInApi';

export function useTodayCheckIns() {
  const userId = useAuthStore((s) => s.user?.id);

  return useSuspenseQuery({
    queryKey: ['check-ins', 'today', userId],
    queryFn: () => {
      if (!userId) throw new Error('User not authenticated');
      return fetchTodayCheckIns(userId);
    },
  });
}

export function useToggleCheckIn() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);

  return useMutation({
    mutationFn: ({ habitId, date }: { habitId: string; date: string }) =>
      toggleCheckIn(habitId, date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['check-ins'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile', userId] });
    },
  });
}
