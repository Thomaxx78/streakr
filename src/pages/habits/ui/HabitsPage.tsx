import { Suspense, useState } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { Plus } from 'lucide-react';
import { useHabits, HabitCard, HABIT_CATEGORIES, type Habit } from '@/entities/habit';
import { CreateHabitModal } from '@/features/create-habit';
import { EditHabitModal } from '@/features/edit-habit';
import { Button, Input } from '@/shared/ui';
import styles from './HabitsPage.module.css';

function ErrorFallback({ error }: FallbackProps) {
  const message = error instanceof Error ? error.message : 'Erreur inconnue';
  return (
    <div className={styles.errorBox}>
      <p>Erreur : {message}</p>
    </div>
  );
}

function HabitsListSkeleton() {
  return (
    <div className={styles.list}>
      {[1, 2, 3].map((i) => (
        <div key={i} className={styles.skeleton} />
      ))}
    </div>
  );
}

interface HabitListProps {
  search: string;
  category: string;
  onEdit: (habit: Habit) => void;
}

function HabitList({ search, category, onEdit }: HabitListProps) {
  const { data: habits } = useHabits();

  const filtered = habits.filter((h) => {
    const matchSearch = h.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === '' || h.category === category;
    return matchSearch && matchCat;
  });

  if (filtered.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>🔍</span>
        <p className={styles.emptyText}>Aucune habitude trouvée.</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {filtered.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          actions={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(habit)}
            >
              ✏️ Modifier
            </Button>
          }
        />
      ))}
    </div>
  );
}

export function HabitsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editHabit, setEditHabit] = useState<Habit | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>Mes Habitudes</h1>
          <p className={styles.subheading}>Gère et suis tes habitudes quotidiennes</p>
        </div>
        <Button variant="primary" onClick={() => setIsCreateOpen(true)}>
          <Plus size={16} />
          Nouvelle habitude
        </Button>
      </div>

      <div className={styles.filters}>
        <Input
          placeholder="Rechercher une habitude..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className={styles.categoryFilter}>
          <button
            className={`${styles.chip} ${category === '' ? styles.chipActive : ''}`}
            onClick={() => setCategory('')}
            type="button"
          >
            Toutes
          </button>
          {HABIT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`${styles.chip} ${category === cat ? styles.chipActive : ''}`}
              onClick={() => setCategory(cat)}
              type="button"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<HabitsListSkeleton />}>
          <HabitList
            search={search}
            category={category}
            onEdit={setEditHabit}
          />
        </Suspense>
      </ErrorBoundary>

      <CreateHabitModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      {editHabit && (
        <EditHabitModal
          habit={editHabit}
          onClose={() => setEditHabit(null)}
        />
      )}
    </div>
  );
}
