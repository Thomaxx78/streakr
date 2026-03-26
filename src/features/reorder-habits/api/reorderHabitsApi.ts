import { supabase } from '@/shared/config';

export async function reorderHabits(updates: { id: string; position: number }[]): Promise<void> {
  await Promise.all(
    updates.map(({ id, position }) =>
      supabase.from('habits').update({ position }).eq('id', id),
    ),
  );
}
