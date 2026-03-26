import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useCheckInHistory } from '@/entities/check-in';
import { Card } from '@/shared/ui';
import styles from './StreakChart.module.css';

function getWeekLabel(weeksAgo: number): string {
  if (weeksAgo === 0) return 'Cette sem.';
  if (weeksAgo === 1) return 'Sem. -1';
  return `Sem. -${weeksAgo}`;
}

function getMondayOf(date: Date): Date {
  const d = new Date(date);
  const dow = d.getDay();
  const diff = (dow + 6) % 7;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

interface StreakChartInnerProps {
  startDate: string;
  endDate: string;
}

function StreakChartInner({ startDate, endDate }: StreakChartInnerProps) {
  const { data: checkIns } = useCheckInHistory(startDate, endDate);

  const today = new Date();
  const thisMonday = getMondayOf(today);

  const weeklyData = Array.from({ length: 8 }, (_, i) => {
    const weeksAgo = 7 - i;
    const weekStart = new Date(thisMonday);
    weekStart.setDate(weekStart.getDate() - weeksAgo * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const weekStartStr = weekStart.toISOString().split('T')[0] ?? '';
    const weekEndStr = weekEnd.toISOString().split('T')[0] ?? '';

    const count = checkIns.filter(
      (c) => c.checked_at >= weekStartStr && c.checked_at <= weekEndStr,
    ).length;

    return {
      label: getWeekLabel(weeksAgo),
      count,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={weeklyData} margin={{ top: 8, right: 8, left: -20, bottom: 4 }}>
        <XAxis
          dataKey="label"
          tick={{ fontFamily: 'var(--font-display)', fontSize: 11, fill: 'var(--color-fg)' }}
          axisLine={{ stroke: 'var(--color-border)', strokeWidth: 2 }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontFamily: 'var(--font-display)', fontSize: 11, fill: 'var(--color-fg)' }}
          axisLine={{ stroke: 'var(--color-border)', strokeWidth: 2 }}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            border: 'var(--border)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow)',
            fontFamily: 'var(--font-body)',
            backgroundColor: 'var(--color-card)',
          }}
          cursor={{ fill: 'rgba(26,26,26,0.05)' }}
        />
        <Bar
          dataKey="count"
          fill="var(--color-primary)"
          radius={[4, 4, 0, 0]}
          stroke="var(--color-border)"
          strokeWidth={2}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface StreakChartProps {
  startDate: string;
  endDate: string;
}

export function StreakChart({ startDate, endDate }: StreakChartProps) {
  return (
    <Card className={styles.card}>
      <h3 className={styles.title}>Check-ins par semaine</h3>
      <div className={styles.chartWrapper}>
        <StreakChartInner startDate={startDate} endDate={endDate} />
      </div>
    </Card>
  );
}
