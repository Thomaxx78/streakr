import { useEffect, useRef } from 'react';
import { Target } from 'lucide-react';
import { useAuthStore } from '@/features/auth';
import { useHabits } from '@/entities/habit';
import { HabitCard } from '@/entities/habit';
import { useTodayCheckIns, useWeekCheckIns, CheckInButton } from '@/features/check-in';
import { useAwardBadges } from '@/features/award-badge';
import { StreakFreezeSection } from '@/features/streak-freeze';
import styles from './DailyHabits.module.css';

export function DailyHabits() {
  const userId = useAuthStore((s) => s.user?.id);
  const { data: habits } = useHabits(userId);
  const { data: todayCheckIns } = useTodayCheckIns();
  const { data: weekCheckIns } = useWeekCheckIns();
  const { mutate: checkBadges } = useAwardBadges(userId);

  const checkedTodayIds = new Set(todayCheckIns.map((ci) => ci.habit_id));

  // Count weekly check-ins per habit
  const weekCountByHabit = new Map<string, number>();
  for (const ci of weekCheckIns) {
    weekCountByHabit.set(ci.habit_id, (weekCountByHabit.get(ci.habit_id) ?? 0) + 1);
  }

  // Progress: daily = checked today, weekly = target met this week
  const doneCount = habits.filter((h) => {
    if (h.frequency_type === 'weekly') {
      return (weekCountByHabit.get(h.id) ?? 0) >= h.frequency_count;
    }
    return checkedTodayIds.has(h.id);
  }).length;
  const total = habits.length;

  // Confetti quand toutes les habitudes sont complétées
  const prevDoneRef = useRef(doneCount);
  useEffect(() => {
    if (doneCount === total && total > 0 && prevDoneRef.current < total) {
      void import('canvas-confetti').then(({ default: confetti }) => {
        void confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
      });
    }
    prevDoneRef.current = doneCount;
  }, [doneCount, total]);

  if (total === 0) {
    return (
      <div className={styles.empty}>
        <Target size={36} className={styles.emptyIcon} />
        <p className={styles.emptyText}>Aucune habitude pour l'instant.</p>
        <p className={styles.emptyHint}>Crée ta première habitude dans l'onglet "Mes Habitudes" !</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.progress}>
        <span className={styles.progressText}>
          {doneCount} / {total} complétées
        </span>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${total > 0 ? (doneCount / total) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className={styles.list}>
        {habits.map((habit) => {
          const weekCount = weekCountByHabit.get(habit.id) ?? 0;
          const isWeeklyDone = habit.frequency_type === 'weekly' && weekCount >= habit.frequency_count;

          return (
            <HabitCard
              key={habit.id}
              habit={habit}
              actions={
                <div className={styles.habitActions}>
                  {habit.frequency_type === 'weekly' && (
                    <span
                      className={`${styles.weekBadge} ${isWeeklyDone ? styles.weekBadgeDone : ''}`}
                    >
                      {weekCount}/{habit.frequency_count} sem.
                    </span>
                  )}
                  <CheckInButton
                    habitId={habit.id}
                    isChecked={checkedTodayIds.has(habit.id)}
                    onSuccess={() => checkBadges()}
                  />
                </div>
              }
            />
          );
        })}
      </div>

      <StreakFreezeSection userId={userId} />
    </div>
  );
}
