import { create } from 'zustand';

// --- Fonctions pures ---

export function calculateLevel(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

export function calculateTitle(level: number): string {
  if (level >= 15) return 'Dieu de la Discipline';
  if (level >= 10) return 'Légende Vivante';
  if (level >= 7) return 'Maître du Streak';
  if (level >= 5) return 'Seigneur de la Routine';
  if (level >= 3) return 'Habitué du Matin';
  if (level >= 2) return 'Apprenti Streaker';
  return 'Débutant Motivé';
}

export function calculateXpToNextLevel(xp: number): number {
  const level = calculateLevel(xp);
  return level * 100 - xp;
}

export function calculateStreak(
  checkInsByDate: Map<string, Set<string>>,
  activeHabitIds: string[],
): number {
  if (activeHabitIds.length === 0) return 0;

  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0] ?? '';

    const dayCheckIns = checkInsByDate.get(dateStr);
    const allDone = activeHabitIds.every((id) => dayCheckIns?.has(id));

    if (!allDone) break;
    streak++;
  }

  return streak;
}

// --- Store Zustand (état UI uniquement) ---

interface GamificationState {
  lastSeenLevel: number;
  setLastSeenLevel: (level: number) => void;
}

export const useGamificationStore = create<GamificationState>((set) => ({
  lastSeenLevel: 1,
  setLastSeenLevel: (level) => set({ lastSeenLevel: level }),
}));
