import { z } from 'zod';

export const BadgeTypeEnum = z.enum([
  'first_checkin',
  'streak_7',
  'streak_30',
  'checkins_50',
  'checkins_100',
  'habits_5',
]);

export type BadgeType = z.infer<typeof BadgeTypeEnum>;

export const BadgeSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  badge_type: BadgeTypeEnum,
  earned_at: z.string(),
});

export type Badge = z.infer<typeof BadgeSchema>;

export const BadgeListSchema = z.array(BadgeSchema);
