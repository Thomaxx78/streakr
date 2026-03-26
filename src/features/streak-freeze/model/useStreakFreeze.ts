import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createCheckIn } from '@/entities/check-in';
import { useToastStore } from '@/shared/lib/useToastStore';
import { fetchMissedHabitsYesterday, getYesterdayStr } from '../api/streakFreezeApi';

export function useMissedHabitsYesterday(userId: string | undefined) {
  return useQuery({
    queryKey: ['streak-freeze', 'missed', userId],
    queryFn: () => {
      if (!userId) return [];
      return fetchMissedHabitsYesterday(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useRetroCheckIn() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);
  const yesterday = getYesterdayStr();

  return useMutation({
    mutationFn: (habitId: string) => createCheckIn(habitId, yesterday),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['streak-freeze'] });
      void queryClient.invalidateQueries({ queryKey: ['check-ins'] });
      addToast('Rattrapage enregistré ✅');
    },
    onError: (err) =>
      addToast(err instanceof Error ? err.message : 'Erreur', 'error'),
  });
}
