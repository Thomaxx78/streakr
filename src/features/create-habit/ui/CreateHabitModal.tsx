import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { useAuthStore } from '@/features/auth';
import { HABIT_CATEGORIES, HABIT_ICONS } from '@/entities/habit';
import { Button, Input } from '@/shared/ui';
import { CreateHabitFormSchema, type CreateHabitFormData } from '../model/createHabitSchema';
import { createHabit } from '../api/createHabitApi';
import styles from './CreateHabitModal.module.css';

const PRESET_COLORS = [
  '#FF6B35', '#4ECDC4', '#FFE66D', '#A855F7',
  '#FF6B9D', '#45B7D1', '#2ED573', '#FF4757',
];

interface CreateHabitModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateHabitModal({ open, onClose }: CreateHabitModalProps) {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateHabitFormData>({
    resolver: zodResolver(CreateHabitFormSchema),
    defaultValues: {
      name: '',
      description: '',
      category: 'general',
      icon: '🎯',
      color: '#FF6B35',
      xp_per_check: 10,
    },
  });

  const selectedIcon = watch('icon');
  const selectedColor = watch('color');
  const selectedCategory = watch('category');

  const mutation = useMutation({
    mutationFn: (data: CreateHabitFormData) => {
      if (!userId) throw new Error('User not authenticated');
      return createHabit(data, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      reset();
      onClose();
    },
  });

  const onSubmit = (data: CreateHabitFormData) => mutation.mutate(data);

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Nouvelle habitude</h2>
          <button className={styles.closeBtn} onClick={handleClose} type="button">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Input
            label="Nom de l'habitude"
            placeholder="Ex: Méditation du matin"
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
            {errors.category && (
              <span className={styles.error}>{errors.category.message}</span>
            )}
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
            {errors.xp_per_check && (
              <span className={styles.error}>{errors.xp_per_check.message}</span>
            )}
          </div>

          <div className={styles.preview}>
            <span style={{ fontSize: '1.5rem' }}>{selectedIcon}</span>
            <span
              className={styles.previewName}
              style={{ borderLeftColor: selectedColor }}
            >
              {watch('name') || 'Aperçu de ton habitude'}
            </span>
            <span className={styles.previewCategory}>{selectedCategory}</span>
          </div>

          {mutation.error && (
            <p className={styles.serverError}>
              {mutation.error instanceof Error ? mutation.error.message : 'Erreur'}
            </p>
          )}

          <div className={styles.footer}>
            <Button type="button" variant="ghost" onClick={handleClose}>
              Annuler
            </Button>
            <Button type="submit" variant="primary" isLoading={mutation.isPending}>
              Créer l'habitude
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
