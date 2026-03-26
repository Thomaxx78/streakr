import { Suspense } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { Flame, Zap, Trophy, Calendar, Medal } from 'lucide-react';
import { useUserProfile } from '@/entities/user';
import { useHabits } from '@/entities/habit';
import { useTodayCheckIns } from '@/features/check-in';
import { useCheckInHistory } from '@/entities/check-in';
import { calculateLevel, calculateTitle, calculateStreak } from '@/features/gamification';
import { useAuthStore } from '@/features/auth';
import { DailyHabits } from '@/widgets/daily-habits';
import { Card } from '@/shared/ui';
import styles from './DashboardPage.module.css';

function ErrorFallback({ error }: FallbackProps) {
  const message = error instanceof Error ? error.message : 'Erreur inconnue';
  return (
    <div className={styles.errorBox}>
      <p>Erreur : {message}</p>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className={styles.statsGrid}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className={styles.skeleton} />
      ))}
    </div>
  );
}

function HabitsSkeleton() {
  return (
    <div className={styles.list}>
      {[1, 2, 3].map((i) => (
        <div key={i} className={styles.skeletonRow} />
      ))}
    </div>
  );
}

function StatsOverview() {
  const userId = useAuthStore((s) => s.user?.id);
  const { data: profile } = useUserProfile(userId);
  const { data: habits } = useHabits(userId);
  const { data: todayCheckIns } = useTodayCheckIns();

  const today = new Date().toISOString().split('T')[0] ?? '';
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString().split('T')[0] ?? '';
  const { data: recentCheckIns } = useCheckInHistory(userId, thirtyDaysAgo, today);

  const level = calculateLevel(profile.xp);
  const title = calculateTitle(level);

  const activeHabitIds = habits.map((h) => h.id);
  const checkedToday = todayCheckIns.filter((ci) =>
    activeHabitIds.includes(ci.habit_id),
  ).length;

  const checkInsByDate = new Map<string, Set<string>>();
  recentCheckIns.forEach((ci) => {
    const key = ci.checked_at;
    if (!checkInsByDate.has(key)) checkInsByDate.set(key, new Set());
    checkInsByDate.get(key)!.add(ci.habit_id);
  });
  const streak = calculateStreak(checkInsByDate, activeHabitIds);

  const stats = [
    {
      icon: <Flame size={28} />,
      label: 'Streak actuel',
      value: `${streak}j`,
      color: 'primary' as const,
    },
    {
      icon: <Zap size={28} />,
      label: 'XP total',
      value: `${profile.xp} XP`,
      color: 'accent' as const,
    },
    {
      icon: <Trophy size={28} />,
      label: 'Niveau',
      value: `Lvl ${level}`,
      color: 'secondary' as const,
    },
    {
      icon: <Calendar size={28} />,
      label: "Aujourd'hui",
      value: `${checkedToday}/${habits.length}`,
      color: 'muted' as const,
    },
  ];

  return (
    <>
      <div className={styles.titleBadge}>
        <Medal size={16} />
        <span className={styles.titleText}>{title}</span>
      </div>
      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <Card key={stat.label} color={stat.color}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>{stat.icon}</div>
              <div>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

export function DashboardPage() {
  const username = useAuthStore((s) => s.user?.user_metadata?.username as string | undefined);

  return (
    <div className={styles.page}>
      <div className={styles.greeting}>
        <h1>Salut, {username ?? 'Streaker'} !</h1>
        <p className={styles.subtitle}>
          {new Date().toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </p>
      </div>

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<StatsSkeleton />}>
          <StatsOverview />
        </Suspense>
      </ErrorBoundary>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Habitudes du jour</h2>
        </div>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<HabitsSkeleton />}>
            <DailyHabits />
          </Suspense>
        </ErrorBoundary>
      </section>
    </div>
  );
}
