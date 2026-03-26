import { Check, Circle } from 'lucide-react';
import { useToggleCheckIn } from '../model/useCheckIns';
import styles from './CheckInButton.module.css';

interface CheckInButtonProps {
  habitId: string;
  isChecked: boolean;
  date?: string;
}

export function CheckInButton({ habitId, isChecked, date }: CheckInButtonProps) {
  const today = new Date().toISOString().split('T')[0] ?? '';
  const checkDate = date ?? today;
  const { mutate, isPending } = useToggleCheckIn();

  const handleClick = () => {
    mutate({ habitId, date: checkDate });
  };

  return (
    <button
      type="button"
      className={`${styles.btn} ${isChecked ? styles.checked : styles.unchecked}`}
      onClick={handleClick}
      disabled={isPending}
      aria-label={isChecked ? 'Décocher' : 'Cocher'}
    >
      <span className={styles.icon}>{isChecked ? <Check size={16} /> : <Circle size={16} />}</span>
      <span className={styles.label}>{isChecked ? 'Fait !' : 'À faire'}</span>
    </button>
  );
}
