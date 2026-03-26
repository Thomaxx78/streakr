import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {
  HeatmapCalendar,
  StreakChart,
  CategoryBreakdown,
  StatsOverview,
} from '@/widgets/stats';
import styles from './StatsPage.module.css';

type Period = '30' | '90' | '180' | '365';

const PERIODS: { label: string; value: Period }[] = [
  { label: '30 jours', value: '30' },
  { label: '90 jours', value: '90' },
  { label: '6 mois', value: '180' },
  { label: '1 an', value: '365' },
];

function getDateRange(days: number): { startDate: string; endDate: string } {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days + 1);
  return {
    startDate: start.toISOString().split('T')[0] ?? '',
    endDate: end.toISOString().split('T')[0] ?? '',
  };
}

function Skeleton({ height }: { height: number }) {
  return (
    <div
      className={styles.skeleton}
      style={{ height }}
      aria-busy="true"
      aria-label="Chargement..."
    />
  );
}

export const StatsPage = () => {
  const [period, setPeriod] = useState<Period>('90');
  const { startDate, endDate } = getDateRange(Number(period));

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Statistiques</h1>
        <div className={styles.periodSelector}>
          {PERIODS.map((p) => (
            <button
              key={p.value}
              className={`${styles.chip} ${period === p.value ? styles.chipActive : ''}`}
              onClick={() => setPeriod(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Activité</h2>
        <div className={styles.heatmapCard}>
          <ErrorBoundary fallback={<p className={styles.error}>Erreur de chargement</p>}>
            <Suspense fallback={<Skeleton height={120} />}>
              <HeatmapCalendar startDate={startDate} endDate={endDate} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.chartsGrid}>
          <ErrorBoundary fallback={<p className={styles.error}>Erreur de chargement</p>}>
            <Suspense fallback={<Skeleton height={280} />}>
              <StreakChart startDate={startDate} endDate={endDate} />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary fallback={<p className={styles.error}>Erreur de chargement</p>}>
            <Suspense fallback={<Skeleton height={280} />}>
              <CategoryBreakdown />
            </Suspense>
          </ErrorBoundary>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Résumé</h2>
        <ErrorBoundary fallback={<p className={styles.error}>Erreur de chargement</p>}>
          <Suspense fallback={<Skeleton height={140} />}>
            <StatsOverview startDate={startDate} endDate={endDate} />
          </Suspense>
        </ErrorBoundary>
      </section>
    </div>
  );
};
