export { BadgeTypeEnum, BadgeSchema, BadgeListSchema } from './model/badgeSchema';
export type { Badge, BadgeType } from './model/badgeSchema';

export { BADGE_DEFINITIONS, ALL_BADGE_TYPES } from './model/badgeDefinitions';
export type { BadgeDefinition } from './model/badgeDefinitions';

export { fetchUserBadges, awardBadge } from './api/badgeApi';

export { useBadges } from './model/useBadges';

export { BadgeCard } from './ui/BadgeCard';
