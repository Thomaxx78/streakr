import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useHabits } from '@/entities/habit';
import { Card } from '@/shared/ui';
import styles from './CategoryBreakdown.module.css';

const CATEGORY_COLORS: Record<string, string> = {
  general: '#45B7D1',
  sport: '#FF6B35',
  santé: '#2ED573',
  productivité: '#A855F7',
  social: '#FF6B9D',
  créativité: '#FFE66D',
};

function CategoryBreakdownInner() {
  const { data: habits } = useHabits();

  const counts: Record<string, number> = {};
  for (const h of habits) {
    counts[h.category] = (counts[h.category] ?? 0) + 1;
  }

  const total = habits.length;
  const pieData = Object.entries(counts).map(([name, value]) => ({
    name,
    value,
    pct: total > 0 ? Math.round((value / total) * 100) : 0,
  }));

  if (pieData.length === 0) {
    return (
      <p className={styles.empty}>Aucune habitude active</p>
    );
  }

  return (
    <div className={styles.inner}>
      <ResponsiveContainer width={180} height={180}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            dataKey="value"
            stroke="var(--color-border)"
            strokeWidth={2}
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CATEGORY_COLORS[entry.name] ?? '#E5E7EB'}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              border: 'var(--border)',
              borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow)',
              fontFamily: 'var(--font-body)',
              backgroundColor: 'var(--color-card)',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className={styles.legend}>
        {pieData.map((entry) => (
          <div key={entry.name} className={styles.legendItem}>
            <span
              className={styles.legendDot}
              style={{
                backgroundColor: CATEGORY_COLORS[entry.name] ?? '#E5E7EB',
              }}
            />
            <span className={styles.legendName}>{entry.name}</span>
            <span className={styles.legendPct}>{entry.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CategoryBreakdown() {
  return (
    <Card className={styles.card}>
      <h3 className={styles.title}>Répartition par catégorie</h3>
      <CategoryBreakdownInner />
    </Card>
  );
}
