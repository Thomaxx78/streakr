import { type ReactNode } from 'react';
import styles from './Badge.module.css';

type BadgeVariant = 'primary' | 'secondary' | 'accent' | 'danger' | 'success' | 'purple' | 'pink';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge = ({ children, variant = 'primary', className = '' }: BadgeProps) => {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};
