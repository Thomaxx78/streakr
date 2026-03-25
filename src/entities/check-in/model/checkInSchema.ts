import { z } from 'zod';

export const CheckInSchema = z.object({
  id: z.string().uuid(),
  habit_id: z.string().uuid(),
  user_id: z.string().uuid(),
  checked_at: z.string(),
  created_at: z.string(),
});

export type CheckIn = z.infer<typeof CheckInSchema>;

export const CheckInListSchema = z.array(CheckInSchema);
