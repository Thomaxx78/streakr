import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllCheckIns } from '@/entities/check-in';
import { fetchHabits } from '@/entities/habit';
import { fetchUserBadges, awardBadge, BADGE_DEFINITIONS } from '@/entities/badge';
import { useToastStore } from '@/shared/lib/useToastStore';
import { evaluateNewBadges } from './badgeEvaluator';
import type { BadgeType } from '@/entities/badge';

export function useAwardBadges(userId: string | undefined) {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: async (): Promise<BadgeType[]> => {
      if (!userId) return [];

      const [checkIns, habits, existingBadges] = await Promise.all([
        fetchAllCheckIns(userId),
        fetchHabits(userId),
        fetchUserBadges(userId),
      ]);

      const newBadges = evaluateNewBadges(checkIns, habits, existingBadges);
      await Promise.all(newBadges.map((type) => awardBadge(userId, type)));
      return newBadges;
    },
    onSuccess: (newBadges) => {
      if (newBadges.length === 0) return;
      void queryClient.invalidateQueries({ queryKey: ['badges', userId] });
      for (const type of newBadges) {
        const def = BADGE_DEFINITIONS[type];
        addToast(`🏅 Badge débloqué : ${def.label} — ${def.description}`, 'success');
      }
    },
  });
}
