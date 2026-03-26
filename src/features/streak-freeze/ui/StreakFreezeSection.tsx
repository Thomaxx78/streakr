import { useState } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/shared/ui';
import { useMissedHabitsYesterday, useRetroCheckIn } from '../model/useStreakFreeze';
import styles from './StreakFreezeSection.module.css';

interface StreakFreezeSectionProps {
  userId: string | undefined;
}

export function StreakFreezeSection({ userId }: StreakFreezeSectionProps) {
  const [open, setOpen] = useState(false);
  const { data: missed = [], isLoading } = useMissedHabitsYesterday(userId);
  const { mutate: retroCheckIn, isPending } = useRetroCheckIn();

  if (isLoading || missed.length === 0) return null;

  return (
    <div className={styles.wrapper}>
      <button className={styles.toggle} onClick={() => setOpen((v) => !v)}>
        <RotateCcw size={14} />
        <span>
          Rattraper hier ({missed.length} habitude{missed.length > 1 ? 's' : ''} manquée
          {missed.length > 1 ? 's' : ''})
        </span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {open && (
        <div className={styles.list}>
          {missed.map((habit) => (
            <div key={habit.id} className={styles.row}>
              <span className={styles.icon}>{habit.icon}</span>
              <span
                className={styles.name}
                style={{ borderLeftColor: habit.color }}
              >
                {habit.name}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => retroCheckIn(habit.id)}
                isLoading={isPending}
              >
                Rattraper
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
