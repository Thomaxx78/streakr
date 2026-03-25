import { z } from 'zod';

export const EditHabitFormSchema = z.object({
  name: z.string().min(2, 'Minimum 2 caractères').max(50, 'Maximum 50 caractères'),
  description: z.string().max(200, 'Maximum 200 caractères').optional(),
  category: z.enum([
    'general',
    'sport',
    'santé',
    'productivité',
    'social',
    'créativité',
  ]),
  icon: z.enum(['🎯', '💪', '🧘', '📚', '🏃', '💻', '🎨', '🎵', '💤', '🥗', '💧', '🧠']),
  color: z.string(),
  xp_per_check: z.number().min(5, 'Minimum 5 XP').max(50, 'Maximum 50 XP'),
});

export type EditHabitFormData = z.infer<typeof EditHabitFormSchema>;
