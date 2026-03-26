import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, SkipForward, Trophy, Zap } from 'lucide-react';
import { useAuthStore } from '@/features/auth';
import { useHabits, type Habit } from '@/entities/habit';
import { useTodayCheckIns, useWeekCheckIns, useToggleCheckIn } from '@/features/check-in';
import { Button } from '@/shared/ui';
import styles from './FocusPage.module.css';

function FocusComplete({ total, skipped }: { total: number; skipped: number }) {
  const navigate = useNavigate();
  const done = total - skipped;

  return (
    <div className={styles.complete}>
      <Trophy size={64} className={styles.completeIcon} />
      <h1 className={styles.completeTitle}>Session terminée !</h1>
      <p className={styles.completeSub}>
        {done > 0 ? `${done} habitude${done > 1 ? 's' : ''} complétée${done > 1 ? 's' : ''}` : 'Aucune habitude cochée'}
        {skipped > 0 ? `, ${skipped} ignorée${skipped > 1 ? 's' : ''}` : ''}
      </p>
      <div className={styles.completeActions}>
        <Button variant="primary" onClick={() => navigate('/dashboard')}>
          Retour au dashboard
        </Button>
        <Button variant="ghost" onClick={() => navigate('/habits')}>
          Mes habitudes
        </Button>
      </div>
    </div>
  );
}

function FocusCard({ habit, weekCount }: { habit: Habit; weekCount: number }) {
  return (
    <div className={styles.habitCard} style={{ borderColor: habit.color }}>
      <span className={styles.habitIcon}>{habit.icon}</span>
      <h2 className={styles.habitName}>{habit.name}</h2>
      {habit.description && (
        <p className={styles.habitDesc}>{habit.description}</p>
      )}
      <div className={styles.habitMeta}>
        <span className={styles.metaBadge} style={{ backgroundColor: habit.color }}>
          {habit.category}
        </span>
        <span className={styles.metaXp}>
          <Zap size={14} /> +{habit.xp_per_check} XP
        </span>
        {habit.frequency_type === 'weekly' && (
          <span className={styles.metaBadge}>
            {weekCount}/{habit.frequency_count} cette semaine
          </span>
        )}
      </div>
    </div>
  );
}

function FocusContent() {
  const userId = useAuthStore((s) => s.user?.id);
  const { data: habits } = useHabits(userId);
  const { data: todayCheckIns } = useTodayCheckIns();
  const { data: weekCheckIns } = useWeekCheckIns();
  const { mutate: toggle, isPending } = useToggleCheckIn();

  const today = new Date().toISOString().split('T')[0] ?? '';
  const checkedTodayIds = new Set(todayCheckIns.map((ci) => ci.habit_id));

  const weekCountByHabit = new Map<string, number>();
  for (const ci of weekCheckIns) {
    weekCountByHabit.set(ci.habit_id, (weekCountByHabit.get(ci.habit_id) ?? 0) + 1);
  }

  // Habits that still need attention
  const pendingHabits = habits.filter((h) => {
    if (h.frequency_type === 'weekly') {
      return (weekCountByHabit.get(h.id) ?? 0) < h.frequency_count;
    }
    return !checkedTodayIds.has(h.id);
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [checkedCount, setCheckedCount] = useState(0);

  const totalPending = pendingHabits.length;
  const current = pendingHabits[currentIndex];
  const isDone = currentIndex >= totalPending;

  if (isDone || totalPending === 0) {
    return (
      <FocusComplete
        total={checkedCount + skippedCount}
        skipped={skippedCount}
      />
    );
  }

  const handleCheck = () => {
    if (!current || isPending) return;
    toggle({ habitId: current.id, date: today, wasChecked: false });
    setCheckedCount((c) => c + 1);
    setCurrentIndex((i) => i + 1);
  };

  const handleSkip = () => {
    setSkippedCount((c) => c + 1);
    setCurrentIndex((i) => i + 1);
  };

  const progressPct = ((currentIndex) / totalPending) * 100;

  return (
    <div className={styles.focusContent}>
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
      </div>
      <p className={styles.counter}>
        {currentIndex + 1} / {totalPending}
      </p>

      {current && (
        <FocusCard
          habit={current}
          weekCount={weekCountByHabit.get(current.id) ?? 0}
        />
      )}

      <div className={styles.focusActions}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSkip}
          disabled={isPending}
        >
          <SkipForward size={16} /> Ignorer
        </Button>
        <Button
          variant="primary"
          onClick={handleCheck}
          isLoading={isPending}
        >
          <Check size={20} /> C'est fait !
        </Button>
      </div>
    </div>
  );
}

export function FocusPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} /> Retour
        </button>
        <h1 className={styles.title}>Mode Focus</h1>
      </div>

      <div className={styles.center}>
        <ErrorBoundary fallback={<p>Erreur lors du chargement.</p>}>
          <Suspense fallback={<div className={styles.loading}>Chargement...</div>}>
            <FocusContent />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}
