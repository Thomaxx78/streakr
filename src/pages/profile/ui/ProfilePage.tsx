import { Suspense, useState } from 'react';
import type { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Leaf, Zap, Sun, Crown, Flame, Trophy, Star, Lock } from 'lucide-react';
import { useAuthStore } from '@/features/auth';
import {
  calculateLevel,
  calculateTitle,
  calculateXpToNextLevel,
} from '@/features/gamification';
import { useUserProfile, useUpdateProfile } from '@/entities/user';
import { useBadges, BadgeCard, ALL_BADGE_TYPES } from '@/entities/badge';
import { useUIStore } from '@/shared/lib/useUIStore';
import { Input, Button } from '@/shared/ui';
import styles from './ProfilePage.module.css';

const UpdateProfileSchema = z.object({
  username: z
    .string()
    .min(3, 'Minimum 3 caractères')
    .max(20, 'Maximum 20 caractères'),
});

type UpdateProfileFormData = z.infer<typeof UpdateProfileSchema>;

const ALL_TITLES: { title: string; minLevel: number; icon: ReactNode }[] = [
  { title: 'Débutant Motivé', minLevel: 1, icon: <Leaf size={20} /> },
  { title: 'Apprenti Streaker', minLevel: 2, icon: <Zap size={20} /> },
  { title: 'Habitué du Matin', minLevel: 3, icon: <Sun size={20} /> },
  { title: 'Seigneur de la Routine', minLevel: 5, icon: <Crown size={20} /> },
  { title: 'Maître du Streak', minLevel: 7, icon: <Flame size={20} /> },
  { title: 'Légende Vivante', minLevel: 10, icon: <Trophy size={20} /> },
  { title: 'Dieu de la Discipline', minLevel: 15, icon: <Star size={20} /> },
];

const ACCENT_COLORS = [
  { color: '#FF6B35', label: 'Orange' },
  { color: '#4ECDC4', label: 'Teal' },
  { color: '#FFE66D', label: 'Jaune' },
  { color: '#A855F7', label: 'Violet' },
  { color: '#FF6B9D', label: 'Rose' },
  { color: '#45B7D1', label: 'Bleu' },
  { color: '#2ED573', label: 'Vert' },
  { color: '#FF4757', label: 'Rouge' },
];

function ProfileSection() {
  const user = useAuthStore((s) => s.user);
  const { data: profile } = useUserProfile(user?.id);
  const { mutate: updateProfile, isPending } = useUpdateProfile(user?.id);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: { username: profile.username },
  });

  const onSubmit = (data: UpdateProfileFormData) => {
    updateProfile(
      { username: data.username },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  const initials = profile.username.slice(0, 2).toUpperCase();
  const joinedDate = new Date(profile.created_at).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>Mon Profil</h2>
      <div className={styles.profileRow}>
        <div className={styles.avatar}>
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.username} className={styles.avatarImg} />
          ) : (
            <span className={styles.avatarInitials}>{initials}</span>
          )}
        </div>
        <div className={styles.profileInfo}>
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className={styles.editForm}>
              <Input
                label="Pseudo"
                error={errors.username?.message}
                {...register('username')}
              />
              <div className={styles.editActions}>
                <Button type="submit" size="sm" isLoading={isPending}>
                  Sauvegarder
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsEditing(false);
                    reset({ username: profile.username });
                  }}
                >
                  Annuler
                </Button>
              </div>
            </form>
          ) : (
            <>
              <h3 className={styles.username}>{profile.username}</h3>
              <p className={styles.email}>{user?.email}</p>
              <p className={styles.joined}>Membre depuis {joinedDate}</p>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
              >
                Modifier
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function GamificationSection() {
  const userId = useAuthStore((s) => s.user?.id);
  const { data: profile } = useUserProfile(userId);

  const level = calculateLevel(profile.xp);
  const title = calculateTitle(level);
  const xpToNext = calculateXpToNextLevel(profile.xp);
  const xpForCurrentLevel = (level - 1) * 100;
  const xpInCurrentLevel = profile.xp - xpForCurrentLevel;
  const progressPct = Math.min((xpInCurrentLevel / 100) * 100, 100);

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>Gamification</h2>

      <div className={styles.levelBadge}>
        <span className={styles.levelNumber}>Niveau {level}</span>
        <span className={styles.activeTitle}>{title}</span>
      </div>

      <div className={styles.xpRow}>
        <span className={styles.xpText}>{profile.xp} XP</span>
        <span className={styles.xpNext}>+{xpToNext} XP pour le niveau suivant</span>
      </div>

      <div className={styles.progressTrack}>
        <div
          className={styles.progressFill}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className={styles.titlesGrid}>
        {ALL_TITLES.map(({ title: t, minLevel, icon }) => {
          const unlocked = level >= minLevel;
          return (
            <div
              key={t}
              className={`${styles.titleCard} ${unlocked ? styles.titleUnlocked : styles.titleLocked}`}
            >
              <span className={styles.titleIcon}>{unlocked ? icon : <Lock size={20} />}</span>
              <span className={styles.titleName}>{t}</span>
              <span className={styles.titleReq}>Niv. {minLevel}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BadgesSection() {
  const userId = useAuthStore((s) => s.user?.id);
  const { data: earned } = useBadges(userId);
  const earnedMap = new Map(earned.map((b) => [b.badge_type, b.earned_at]));

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>Badges</h2>
      <div className={styles.badgesGrid}>
        {ALL_BADGE_TYPES.map((type) => {
          const earnedAt = earnedMap.get(type);
          return (
            <BadgeCard
              key={type}
              badgeType={type}
              earnedAt={earnedAt}
              locked={!earnedAt}
            />
          );
        })}
      </div>
    </div>
  );
}

function PreferencesSection() {
  const accentColor = useUIStore((s) => s.accentColor);
  const setAccentColor = useUIStore((s) => s.setAccentColor);

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>Préférences</h2>

      <p className={styles.prefLabel}>Couleur d'accent</p>
      <div className={styles.colorGrid}>
        {ACCENT_COLORS.map(({ color, label }) => (
          <button
            key={color}
            className={`${styles.colorSwatch} ${accentColor === color ? styles.colorSwatchActive : ''}`}
            style={{ backgroundColor: color }}
            aria-label={label}
            title={label}
            onClick={() => setAccentColor(color)}
          />
        ))}
      </div>
    </div>
  );
}

function ProfileContent() {
  return (
    <div className={styles.sections}>
      <ErrorBoundary fallback={<p className={styles.error}>Erreur profil</p>}>
        <Suspense fallback={<div className={styles.skeleton} style={{ height: 160 }} />}>
          <ProfileSection />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary fallback={<p className={styles.error}>Erreur gamification</p>}>
        <Suspense fallback={<div className={styles.skeleton} style={{ height: 320 }} />}>
          <GamificationSection />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary fallback={<p className={styles.error}>Erreur badges</p>}>
        <Suspense fallback={<div className={styles.skeleton} style={{ height: 180 }} />}>
          <BadgesSection />
        </Suspense>
      </ErrorBoundary>
      <PreferencesSection />
    </div>
  );
}

export const ProfilePage = () => {
  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Profil & Paramètres</h1>
      <ProfileContent />
    </div>
  );
};
