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

export const HabitFrequencyEnum = z.enum(['daily', 'weekly']);
export type HabitFrequency = z.infer<typeof HabitFrequencyEnum>;

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
  frequency_type: HabitFrequencyEnum.default('daily'),
  frequency_count: z.number().min(1).max(7).default(1),
  position: z.number().nullable(),
});

export type Habit = z.infer<typeof HabitSchema>;

export const HabitListSchema = z.array(HabitSchema);
