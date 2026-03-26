import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reorderHabits } from '../api/reorderHabitsApi';

export function useReorderHabits() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reorderHabits,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });
}
