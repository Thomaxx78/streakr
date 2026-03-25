import { useHabits } from '@/entities/habit';
import { HabitCard } from '@/entities/habit';
import { useTodayCheckIns, CheckInButton } from '@/features/check-in';
import styles from './DailyHabits.module.css';

export function DailyHabits() {
  const { data: habits } = useHabits();
  const { data: checkIns } = useTodayCheckIns();

  const checkedHabitIds = new Set(checkIns.map((ci) => ci.habit_id));
  const checkedCount = habits.filter((h) => checkedHabitIds.has(h.id)).length;
  const total = habits.length;

  if (total === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>🎯</span>
        <p className={styles.emptyText}>Aucune habitude pour l'instant.</p>
        <p className={styles.emptyHint}>Crée ta première habitude dans l'onglet "Mes Habitudes" !</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.progress}>
        <span className={styles.progressText}>
          {checkedCount} / {total} complétées
        </span>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${total > 0 ? (checkedCount / total) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className={styles.list}>
        {habits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            actions={
              <CheckInButton
                habitId={habit.id}
                isChecked={checkedHabitIds.has(habit.id)}
              />
            }
          />
        ))}
      </div>
    </div>
  );
}
