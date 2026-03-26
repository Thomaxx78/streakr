import type { BadgeType } from '../model/badgeSchema';
import { BADGE_DEFINITIONS } from '../model/badgeDefinitions';
import styles from './BadgeCard.module.css';

interface BadgeCardProps {
  badgeType: BadgeType;
  earnedAt?: string;
  locked?: boolean;
}

export function BadgeCard({ badgeType, earnedAt, locked = false }: BadgeCardProps) {
  const def = BADGE_DEFINITIONS[badgeType];
  const date = earnedAt
    ? new Date(earnedAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <div className={`${styles.card} ${locked ? styles.locked : styles.unlocked}`}>
      <span className={styles.icon}>{locked ? '🔒' : def.icon}</span>
      <span className={styles.label}>{def.label}</span>
      <span className={styles.description}>{def.description}</span>
      {date && !locked && <span className={styles.date}>{date}</span>}
    </div>
  );
}
