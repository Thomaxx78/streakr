import type { CheckIn } from '@/entities/check-in';
import type { Habit } from '@/entities/habit';
import type { Badge, BadgeType } from '@/entities/badge';

function computeStreak(checkIns: CheckIn[], activeHabitIds: string[]): number {
  if (activeHabitIds.length === 0) return 0;

  const byDate = new Map<string, Set<string>>();
  for (const ci of checkIns) {
    if (!byDate.has(ci.checked_at)) byDate.set(ci.checked_at, new Set());
    byDate.get(ci.checked_at)!.add(ci.habit_id);
  }

  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0] ?? '';
    const day = byDate.get(dateStr);
    if (!activeHabitIds.every((id) => day?.has(id))) break;
    streak++;
  }
  return streak;
}

export function evaluateNewBadges(
  checkIns: CheckIn[],
  habits: Habit[],
  existingBadges: Badge[],
): BadgeType[] {
  const existing = new Set(existingBadges.map((b) => b.badge_type));
  const totalCheckIns = checkIns.length;
  const habitCount = habits.length;
  const activeHabitIds = habits.map((h) => h.id);
  const streak = computeStreak(checkIns, activeHabitIds);

  const conditions: [BadgeType, boolean][] = [
    ['first_checkin', totalCheckIns >= 1],
    ['checkins_50', totalCheckIns >= 50],
    ['checkins_100', totalCheckIns >= 100],
    ['habits_5', habitCount >= 5],
    ['streak_7', streak >= 7],
    ['streak_30', streak >= 30],
  ];

  return conditions
    .filter(([type, met]) => met && !existing.has(type))
    .map(([type]) => type);
}
