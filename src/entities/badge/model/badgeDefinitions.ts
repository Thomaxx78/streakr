import type { BadgeType } from './badgeSchema';

export interface BadgeDefinition {
  type: BadgeType;
  label: string;
  description: string;
  icon: string;
}

export const BADGE_DEFINITIONS: Record<BadgeType, BadgeDefinition> = {
  first_checkin: {
    type: 'first_checkin',
    label: 'Premier Pas',
    description: 'Premier check-in effectué',
    icon: '🎯',
  },
  streak_7: {
    type: 'streak_7',
    label: 'Semaine Parfaite',
    description: '7 jours consécutifs complétés',
    icon: '🔥',
  },
  streak_30: {
    type: 'streak_30',
    label: 'Mois de Feu',
    description: '30 jours consécutifs complétés',
    icon: '🌋',
  },
  checkins_50: {
    type: 'checkins_50',
    label: 'Assidu',
    description: '50 check-ins au total',
    icon: '⚡',
  },
  checkins_100: {
    type: 'checkins_100',
    label: 'Centurion',
    description: '100 check-ins au total',
    icon: '💎',
  },
  habits_5: {
    type: 'habits_5',
    label: 'Collectionneur',
    description: '5 habitudes actives créées',
    icon: '🏆',
  },
};

export const ALL_BADGE_TYPES = Object.keys(BADGE_DEFINITIONS) as BadgeType[];
