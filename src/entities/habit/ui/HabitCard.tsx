import type { ReactNode } from 'react';
import { Badge } from '@/shared/ui';
import type { Habit } from '../model/habitSchema';
import styles from './HabitCard.module.css';

interface HabitCardProps {
  habit: Habit;
  actions?: ReactNode;
}

export function HabitCard({ habit, actions }: HabitCardProps) {
  return (
    <div className={styles.card} style={{ borderLeftColor: habit.color }}>
      <div className={styles.left}>
        <span className={styles.icon}>{habit.icon}</span>
        <div className={styles.info}>
          <h3 className={styles.name}>{habit.name}</h3>
          {habit.description && (
            <p className={styles.description}>{habit.description}</p>
          )}
          <div className={styles.meta}>
            <Badge variant="secondary">{habit.category}</Badge>
            <span className={styles.xp}>+{habit.xp_per_check} XP</span>
          </div>
        </div>
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}
