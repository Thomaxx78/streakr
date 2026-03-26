import type { ReactNode } from 'react';
import { Flame, CheckCircle2, BarChart3, Star } from 'lucide-react';
import { useCheckInHistory } from '@/entities/check-in';
import { useHabits } from '@/entities/habit';
import type { CheckIn } from '@/entities/check-in';
import styles from './StatsOverview.module.css';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <div className={styles.statCard} style={{ borderTopColor: color }}>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.value}>{value}</span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}

function computeBestStreak(checkIns: CheckIn[], totalHabits: number): number {
  if (totalHabits === 0) return 0;

  const byDate = new Map<string, Set<string>>();
  for (const ci of checkIns) {
    const existing = byDate.get(ci.checked_at);
    if (existing) {
      existing.add(ci.habit_id);
    } else {
      byDate.set(ci.checked_at, new Set([ci.habit_id]));
    }
  }

  const sortedDates = Array.from(byDate.keys()).sort();
  let best = 0;
  let current = 0;

  for (let i = 0; i < sortedDates.length; i++) {
    const dateStr = sortedDates[i];
    if (!dateStr) continue;
    const checkedCount = byDate.get(dateStr)?.size ?? 0;
    const allDone = checkedCount >= totalHabits;

    if (allDone) {
      if (i > 0) {
        const prevStr = sortedDates[i - 1];
        if (prevStr) {
          const prev = new Date(prevStr);
          const curr = new Date(dateStr);
          const diff = (curr.getTime() - prev.getTime()) / 86400000;
          if (diff === 1) {
            current++;
          } else {
            current = 1;
          }
        } else {
          current = 1;
        }
      } else {
        current = 1;
      }
      if (current > best) best = current;
    } else {
      current = 0;
    }
  }

  return best;
}

function computeCompletionRate(checkIns: CheckIn[], totalHabits: number): number {
  if (totalHabits === 0 || checkIns.length === 0) return 0;

  const byDate = new Map<string, number>();
  for (const ci of checkIns) {
    byDate.set(ci.checked_at, (byDate.get(ci.checked_at) ?? 0) + 1);
  }

  const rates = Array.from(byDate.values()).map((count) =>
    Math.min(count / totalHabits, 1),
  );

  const avg = rates.reduce((a, b) => a + b, 0) / rates.length;
  return Math.round(avg * 100);
}

function computePerfectDays(checkIns: CheckIn[], totalHabits: number): number {
  if (totalHabits === 0) return 0;

  const byDate = new Map<string, number>();
  for (const ci of checkIns) {
    byDate.set(ci.checked_at, (byDate.get(ci.checked_at) ?? 0) + 1);
  }

  let count = 0;
  for (const v of byDate.values()) {
    if (v >= totalHabits) count++;
  }
  return count;
}

interface StatsOverviewInnerProps {
  startDate: string;
  endDate: string;
  totalHabits: number;
}

function StatsOverviewInner({ startDate, endDate, totalHabits }: StatsOverviewInnerProps) {
  const { data: checkIns } = useCheckInHistory(startDate, endDate);

  const bestStreak = computeBestStreak(checkIns, totalHabits);
  const totalCheckIns = checkIns.length;
  const completionRate = computeCompletionRate(checkIns, totalHabits);
  const perfectDays = computePerfectDays(checkIns, totalHabits);

  return (
    <div className={styles.grid}>
      <StatCard
        icon={<Flame size={28} />}
        label="Meilleur streak"
        value={`${bestStreak} j`}
        color="var(--color-primary)"
      />
      <StatCard
        icon={<CheckCircle2 size={28} />}
        label="Total check-ins"
        value={totalCheckIns}
        color="var(--color-secondary)"
      />
      <StatCard
        icon={<BarChart3 size={28} />}
        label="Taux de complétion"
        value={`${completionRate}%`}
        color="var(--color-purple)"
      />
      <StatCard
        icon={<Star size={28} />}
        label="Jours parfaits"
        value={perfectDays}
        color="var(--color-accent)"
      />
    </div>
  );
}

interface StatsOverviewProps {
  startDate: string;
  endDate: string;
}

export function StatsOverview({ startDate, endDate }: StatsOverviewProps) {
  const { data: habits } = useHabits();
  return (
    <StatsOverviewInner
      startDate={startDate}
      endDate={endDate}
      totalHabits={habits.length}
    />
  );
}
