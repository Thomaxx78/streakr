import { z } from 'zod';

export const HabitCategoryEnum = z.enum([
  'general',
  'sport',
  'santé',
  'productivité',
  'social',
  'créativité',
]);

export const HabitIconEnum = z.enum([
  '🎯',
  '💪',
  '🧘',
  '📚',
  '🏃',
  '💻',
  '🎨',
  '🎵',
  '💤',
  '🥗',
  '💧',
  '🧠',
]);

export const HABIT_CATEGORIES = HabitCategoryEnum.options;
export const HABIT_ICONS = HabitIconEnum.options;

export type HabitCategory = z.infer<typeof HabitCategoryEnum>;
export type HabitIcon = z.infer<typeof HabitIconEnum>;

export const HabitSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().nullable(),
  category: z.string(),
  icon: z.string(),
  color: z.string(),
  xp_per_check: z.number().nonnegative('XP ne peut pas être négatif'),
  is_archived: z.boolean(),
  created_at: z.string(),
});

export type Habit = z.infer<typeof HabitSchema>;

export const HabitListSchema = z.array(HabitSchema);
