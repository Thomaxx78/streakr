import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth';
import { useToastStore } from '@/shared/lib/useToastStore';
import { fetchTodayCheckIns, fetchWeekCheckIns, toggleCheckIn } from '../api/checkInApi';

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
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: ({ habitId, date }: { habitId: string; date: string; wasChecked: boolean }) =>
      toggleCheckIn(habitId, date),
    onSuccess: (_, { wasChecked }) => {
      queryClient.invalidateQueries({ queryKey: ['check-ins'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile', userId] });
      if (!wasChecked) addToast('Check-in enregistré ! +XP 🎯');
    },
    onError: (err) => addToast(err instanceof Error ? err.message : 'Erreur', 'error'),
  });
}

export function useWeekCheckIns() {
  const userId = useAuthStore((s) => s.user?.id);

  return useSuspenseQuery({
    queryKey: ['check-ins', 'week', userId],
    queryFn: () => {
      if (!userId) throw new Error('User not authenticated');
      return fetchWeekCheckIns(userId);
    },
  });
}
