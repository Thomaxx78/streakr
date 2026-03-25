import { z } from 'zod';

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  avatar_url: z.string().nullable(),
  xp: z.number().int().nonnegative(),
  level: z.number().int().positive(),
  active_title: z.string().nullable(),
  created_at: z.string(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;
