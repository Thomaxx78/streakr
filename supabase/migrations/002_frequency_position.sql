-- Migration 002: Add frequency type, frequency count and position to habits

ALTER TABLE habits
  ADD COLUMN IF NOT EXISTS frequency_type TEXT NOT NULL DEFAULT 'daily',
  ADD COLUMN IF NOT EXISTS frequency_count INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS position INTEGER;

ALTER TABLE habits
  ADD CONSTRAINT habits_frequency_type_check
    CHECK (frequency_type IN ('daily', 'weekly')),
  ADD CONSTRAINT habits_frequency_count_check
    CHECK (frequency_count >= 1 AND frequency_count <= 7);

-- Initialize positions for existing habits (ordered by creation date per user)
WITH ranked AS (
  SELECT id,
    (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at ASC) - 1) AS rn
  FROM habits
)
UPDATE habits SET position = ranked.rn
FROM ranked WHERE habits.id = ranked.id;
