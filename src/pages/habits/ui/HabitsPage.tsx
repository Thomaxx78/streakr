import { Suspense, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { Plus, Search, Pencil, Archive, RotateCcw } from 'lucide-react';
import { useHabits, useArchivedHabits, HabitCard, HABIT_CATEGORIES, type Habit } from '@/entities/habit';
import { CreateHabitModal } from '@/features/create-habit';
import { EditHabitModal } from '@/features/edit-habit';
import { restoreHabit } from '@/features/edit-habit';
import { Button, Input } from '@/shared/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
        <Search size={36} />
        <p className={styles.emptyText}>Aucune habitude trouvée.</p>
        {(search || category) && (
          <p className={styles.emptyHint}>Essaie de modifier tes filtres.</p>
        )}
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
            <Button variant="ghost" size="sm" onClick={() => onEdit(habit)}>
              <Pencil size={14} /> Modifier
            </Button>
          }
        />
      ))}
    </div>
  );
}

function ArchivedList() {
  const { data: habits } = useArchivedHabits();
  const queryClient = useQueryClient();

  const restoreMutation = useMutation({
    mutationFn: (habitId: string) => restoreHabit(habitId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['habits'] }),
  });

  if (habits.length === 0) {
    return (
      <div className={styles.empty}>
        <Archive size={36} />
        <p className={styles.emptyText}>Aucune habitude archivée.</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          actions={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => restoreMutation.mutate(habit.id)}
              isLoading={restoreMutation.isPending}
            >
              <RotateCcw size={14} /> Restaurer
            </Button>
          }
        />
      ))}
    </div>
  );
}

export function HabitsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editHabit, setEditHabit] = useState<Habit | null>(null);
  const [tab, setTab] = useState<'active' | 'archived'>('active');

  const search = searchParams.get('search') ?? '';
  const category = searchParams.get('category') ?? '';

  const updateSearch = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('search', value);
      else next.delete('search');
      return next;
    }, { replace: true });
  };

  const updateCategory = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('category', value);
      else next.delete('category');
      return next;
    }, { replace: true });
  };

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

      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${tab === 'active' ? styles.tabActive : ''}`}
          onClick={() => setTab('active')}
        >
          Actives
        </button>
        <button
          type="button"
          className={`${styles.tab} ${tab === 'archived' ? styles.tabActive : ''}`}
          onClick={() => setTab('archived')}
        >
          <Archive size={14} /> Archivées
        </button>
      </div>

      {tab === 'active' && (
        <div className={styles.filters}>
          <Input
            placeholder="Rechercher une habitude..."
            value={search}
            onChange={(e) => updateSearch(e.target.value)}
          />
          <div className={styles.categoryFilter}>
            <button
              className={`${styles.chip} ${category === '' ? styles.chipActive : ''}`}
              onClick={() => updateCategory('')}
              type="button"
            >
              Toutes
            </button>
            {HABIT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`${styles.chip} ${category === cat ? styles.chipActive : ''}`}
                onClick={() => updateCategory(cat)}
                type="button"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<HabitsListSkeleton />}>
          {tab === 'active' ? (
            <HabitList search={search} category={category} onEdit={setEditHabit} />
          ) : (
            <ArchivedList />
          )}
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
