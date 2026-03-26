import { Suspense } from 'react';
import { X, Flame, TrendingUp, CheckCircle, Calendar } from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';
import type { Habit } from '@/entities/habit';
import { useHabitStats } from '../model/useHabitStats';
import styles from './HabitStatsModal.module.css';

interface Props {
  habit: Habit;
  onClose: () => void;
}

function StatsContent({ habit }: { habit: Habit }) {
  const { data: stats } = useHabitStats(habit);

  return (
    <div className={styles.content}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <CheckCircle size={24} className={styles.statIcon} />
          <span className={styles.statValue}>{stats.totalCheckIns}</span>
          <span className={styles.statLabel}>Total check-ins</span>
        </div>
        <div className={styles.statCard}>
          <Flame size={24} className={styles.statIcon} />
          <span className={styles.statValue}>{stats.currentStreak}</span>
          <span className={styles.statLabel}>Streak actuel</span>
        </div>
        <div className={styles.statCard}>
          <TrendingUp size={24} className={styles.statIcon} />
          <span className={styles.statValue}>{stats.bestStreak}</span>
          <span className={styles.statLabel}>Meilleur streak</span>
        </div>
        <div className={styles.statCard}>
          <Calendar size={24} className={styles.statIcon} />
          <span className={styles.statValue}>{stats.last30DaysRate}%</span>
          <span className={styles.statLabel}>30 derniers jours</span>
        </div>
      </div>

      <div className={styles.rateSection}>
        <div className={styles.rateHeader}>
          <span className={styles.rateLabel}>Taux de complétion (30j)</span>
          <span className={styles.rateValue}>{stats.last30DaysRate}%</span>
        </div>
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${stats.last30DaysRate}%` }}
          />
        </div>
      </div>

      <div className={styles.freqInfo}>
        <span className={styles.freqLabel}>Fréquence :</span>
        <span className={styles.freqValue}>
          {habit.frequency_type === 'weekly'
            ? `${habit.frequency_count}x / semaine`
            : 'Quotidien'}
        </span>
      </div>
    </div>
  );
}

export function HabitStatsModal({ habit, onClose }: Props) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.habitIcon}>{habit.icon}</span>
            <div>
              <h2 className={styles.title}>{habit.name}</h2>
              <span className={styles.category}>{habit.category}</span>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        <ErrorBoundary fallback={<p className={styles.error}>Erreur lors du chargement des stats</p>}>
          <Suspense fallback={<div className={styles.loading}>Chargement...</div>}>
            <StatsContent habit={habit} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}
