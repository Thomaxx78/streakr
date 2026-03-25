import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HABIT_CATEGORIES, HABIT_ICONS, type Habit } from '@/entities/habit';
import { Button, Input } from '@/shared/ui';
import { EditHabitFormSchema, type EditHabitFormData } from '../model/editHabitSchema';
import { updateHabit, deleteHabit, archiveHabit } from '../api/editHabitApi';
import styles from './EditHabitModal.module.css';

const PRESET_COLORS = [
  '#FF6B35', '#4ECDC4', '#FFE66D', '#A855F7',
  '#FF6B9D', '#45B7D1', '#2ED573', '#FF4757',
];

interface EditHabitModalProps {
  habit: Habit;
  onClose: () => void;
}

export function EditHabitModal({ habit, onClose }: EditHabitModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<EditHabitFormData>({
    resolver: zodResolver(EditHabitFormSchema),
    defaultValues: {
      name: habit.name,
      description: habit.description ?? '',
      category: habit.category as EditHabitFormData['category'],
      icon: habit.icon as EditHabitFormData['icon'],
      color: habit.color,
      xp_per_check: habit.xp_per_check,
    },
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['habits'] });
  };

  const updateMutation = useMutation({
    mutationFn: (data: EditHabitFormData) => updateHabit(habit.id, data),
    onSuccess: () => { invalidate(); onClose(); },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteHabit(habit.id),
    onSuccess: () => { invalidate(); onClose(); },
  });

  const archiveMutation = useMutation({
    mutationFn: () => archiveHabit(habit.id),
    onSuccess: () => { invalidate(); onClose(); },
  });

  const onSubmit = (data: EditHabitFormData) => updateMutation.mutate(data);

  const handleDelete = () => {
    if (window.confirm(`Supprimer "${habit.name}" définitivement ?`)) {
      deleteMutation.mutate();
    }
  };

  const handleArchive = () => {
    archiveMutation.mutate();
  };

  const selectedIcon = watch('icon');
  const selectedColor = watch('color');

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Modifier l'habitude</h2>
          <button className={styles.closeBtn} onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Input
            label="Nom de l'habitude"
            error={errors.name?.message}
            {...register('name')}
          />

          <div className={styles.field}>
            <label className={styles.label}>Description (optionnel)</label>
            <textarea
              className={styles.textarea}
              placeholder="Décris ton habitude..."
              {...register('description')}
            />
            {errors.description && (
              <span className={styles.error}>{errors.description.message}</span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Catégorie</label>
            <div className={styles.chips}>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <>
                    {HABIT_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        className={`${styles.chip} ${field.value === cat ? styles.chipActive : ''}`}
                        onClick={() => field.onChange(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </>
                )}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Icône</label>
            <div className={styles.iconGrid}>
              <Controller
                name="icon"
                control={control}
                render={({ field }) => (
                  <>
                    {HABIT_ICONS.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        className={`${styles.iconBtn} ${field.value === icon ? styles.iconBtnActive : ''}`}
                        onClick={() => field.onChange(icon)}
                      >
                        {icon}
                      </button>
                    ))}
                  </>
                )}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Couleur</label>
            <div className={styles.colorRow}>
              <Controller
                name="color"
                control={control}
                render={({ field }) => (
                  <>
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`${styles.colorDot} ${field.value === color ? styles.colorDotActive : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => field.onChange(color)}
                      />
                    ))}
                  </>
                )}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              XP par check-in : <strong>{watch('xp_per_check')}</strong>
            </label>
            <Controller
              name="xp_per_check"
              control={control}
              render={({ field }) => (
                <input
                  type="range"
                  min={5}
                  max={50}
                  step={5}
                  className={styles.slider}
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </div>

          <div className={styles.preview}>
            <span style={{ fontSize: '1.5rem' }}>{selectedIcon}</span>
            <span
              className={styles.previewName}
              style={{ borderLeftColor: selectedColor }}
            >
              {watch('name') || habit.name}
            </span>
          </div>

          {(updateMutation.error || deleteMutation.error || archiveMutation.error) && (
            <p className={styles.serverError}>
              {(updateMutation.error ?? deleteMutation.error ?? archiveMutation.error) instanceof Error
                ? (updateMutation.error ?? deleteMutation.error ?? archiveMutation.error as Error).message
                : 'Erreur'}
            </p>
          )}

          <div className={styles.footer}>
            <div className={styles.footerLeft}>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleArchive}
                isLoading={archiveMutation.isPending}
              >
                📦 Archiver
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={handleDelete}
                isLoading={deleteMutation.isPending}
              >
                🗑️ Supprimer
              </Button>
            </div>
            <div className={styles.footerRight}>
              <Button type="button" variant="ghost" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" variant="primary" isLoading={updateMutation.isPending}>
                Sauvegarder
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
