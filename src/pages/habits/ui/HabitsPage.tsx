import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { Plus, Search, Pencil, Archive, RotateCcw, GripVertical, BarChart2 } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAuthStore } from '@/features/auth';
import { useHabits, useArchivedHabits, HabitCard, HABIT_CATEGORIES, type Habit } from '@/entities/habit';
import { CreateHabitModal } from '@/features/create-habit';
import { EditHabitModal } from '@/features/edit-habit';
import { restoreHabit } from '@/features/edit-habit';
import { useReorderHabits } from '@/features/reorder-habits';
import { HabitStatsModal } from '@/features/habit-stats';
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

interface SortableHabitRowProps {
  habit: Habit;
  isDragEnabled: boolean;
  onEdit: (habit: Habit) => void;
  onStats: (habit: Habit) => void;
}

function SortableHabitRow({ habit, isDragEnabled, onEdit, onStats }: SortableHabitRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: habit.id,
    disabled: !isDragEnabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.sortableRow}>
      {isDragEnabled && (
        <button
          type="button"
          className={styles.dragHandle}
          {...attributes}
          {...listeners}
          aria-label="Réordonner"
        >
          <GripVertical size={18} />
        </button>
      )}
      <div className={styles.habitCardWrapper}>
        <HabitCard
          habit={habit}
          actions={
            <div className={styles.habitActions}>
              <Button variant="ghost" size="sm" onClick={() => onStats(habit)}>
                <BarChart2 size={14} />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onEdit(habit)}>
                <Pencil size={14} /> Modifier
              </Button>
            </div>
          }
        />
      </div>
    </div>
  );
}

interface HabitListProps {
  userId: string | undefined;
  search: string;
  category: string;
  onEdit: (habit: Habit) => void;
  onStats: (habit: Habit) => void;
}

function HabitList({ userId, search, category, onEdit, onStats }: HabitListProps) {
  const { data: habitsFromQuery } = useHabits(userId);
  const { mutate: reorder } = useReorderHabits();
  const [habits, setHabits] = useState(habitsFromQuery);

  useEffect(() => {
    setHabits(habitsFromQuery);
  }, [habitsFromQuery]);

  const isDragEnabled = search === '' && category === '';

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const filtered = habits.filter((h) => {
    const matchSearch = h.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === '' || h.category === category;
    return matchSearch && matchCat;
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setHabits((prev) => {
      const oldIdx = prev.findIndex((h) => h.id === active.id);
      const newIdx = prev.findIndex((h) => h.id === over.id);
      const reordered = arrayMove(prev, oldIdx, newIdx);
      reorder(reordered.map((h, i) => ({ id: h.id, position: i })));
      return reordered;
    });
  };

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
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={habits.map((h) => h.id)} strategy={verticalListSortingStrategy}>
        <div className={styles.list}>
          {filtered.map((habit) => (
            <SortableHabitRow
              key={habit.id}
              habit={habit}
              isDragEnabled={isDragEnabled}
              onEdit={onEdit}
              onStats={onStats}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function ArchivedList({ userId }: { userId: string | undefined }) {
  const { data: habits } = useArchivedHabits(userId);
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
  const [statsHabit, setStatsHabit] = useState<Habit | null>(null);
  const userId = useAuthStore((s) => s.user?.id);
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
          {search === '' && category === '' && (
            <p className={styles.dragHint}>
              Glisse les habitudes pour les réordonner
            </p>
          )}
        </div>
      )}

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<HabitsListSkeleton />}>
          {tab === 'active' ? (
            <HabitList
              userId={userId}
              search={search}
              category={category}
              onEdit={setEditHabit}
              onStats={setStatsHabit}
            />
          ) : (
            <ArchivedList userId={userId} />
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

      {statsHabit && (
        <HabitStatsModal
          habit={statsHabit}
          onClose={() => setStatsHabit(null)}
        />
      )}
    </div>
  );
}
