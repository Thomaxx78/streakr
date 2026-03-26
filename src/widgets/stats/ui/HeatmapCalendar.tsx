import { useHabits } from '@/entities/habit';
import { useCheckInHistory } from '@/entities/check-in';
import type { CheckIn } from '@/entities/check-in';
import styles from './HeatmapCalendar.module.css';

const DAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

function getCellColor(
  date: Date | null,
  checkInMap: Map<string, Set<string>>,
  totalHabits: number,
): string {
  if (!date || totalHabits === 0) return 'var(--color-muted)';

  const dateStr = date.toISOString().split('T')[0] ?? '';
  const checkedCount = checkInMap.get(dateStr)?.size ?? 0;

  if (checkedCount === 0) return '#E5E7EB';

  const pct = (checkedCount / totalHabits) * 100;
  if (pct >= 100) return 'var(--color-success)';
  if (pct >= 50) return 'var(--color-secondary)';
  return '#86D9A5';
}

function buildGrid(days: Date[]): (Date | null)[][] {
  const firstDay = days[0];
  if (!firstDay) return [];

  const dow = firstDay.getDay();
  const mondayFirst = (dow + 6) % 7;

  const padded: (Date | null)[] = [
    ...Array<null>(mondayFirst).fill(null),
    ...days,
  ];

  const rem = padded.length % 7;
  if (rem !== 0) {
    padded.push(...Array<null>(7 - rem).fill(null));
  }

  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7));
  }
  return weeks;
}

function buildCheckInMap(checkIns: CheckIn[]): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>();
  for (const ci of checkIns) {
    const existing = map.get(ci.checked_at);
    if (existing) {
      existing.add(ci.habit_id);
    } else {
      map.set(ci.checked_at, new Set([ci.habit_id]));
    }
  }
  return map;
}

interface HeatmapInnerProps {
  startDate: string;
  endDate: string;
  totalHabits: number;
}

function HeatmapInner({ startDate, endDate, totalHabits }: HeatmapInnerProps) {
  const { data: checkIns } = useCheckInHistory(startDate, endDate);

  const checkInMap = buildCheckInMap(checkIns);

  const today = new Date();
  const start = new Date(startDate);
  const days: Date[] = [];
  const cursor = new Date(start);
  while (cursor <= today) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  const weeks = buildGrid(days);

  return (
    <div className={styles.grid}>
      <div className={styles.labels}>
        {DAY_LABELS.map((label, i) => (
          <span key={i} className={styles.dayLabel}>
            {label}
          </span>
        ))}
      </div>
      <div className={styles.weeks}>
        {weeks.map((week, wi) => (
          <div key={wi} className={styles.week}>
            {week.map((day, di) => {
              const color = getCellColor(day, checkInMap, totalHabits);
              const isComplete =
                day !== null &&
                totalHabits > 0 &&
                (checkInMap.get(day.toISOString().split('T')[0] ?? '')?.size ??
                  0) >= totalHabits;
              return (
                <div
                  key={di}
                  className={`${styles.cell} ${day ? '' : styles.empty} ${isComplete ? styles.complete : ''}`}
                  style={{ backgroundColor: day ? color : 'transparent' }}
                  title={
                    day ? (day.toISOString().split('T')[0] ?? '') : undefined
                  }
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

interface HeatmapCalendarProps {
  startDate: string;
  endDate: string;
}

export function HeatmapCalendar({ startDate, endDate }: HeatmapCalendarProps) {
  const { data: habits } = useHabits();

  return (
    <div className={styles.wrapper}>
      <HeatmapInner
        startDate={startDate}
        endDate={endDate}
        totalHabits={habits.length}
      />
    </div>
  );
}
