import { type ReactNode } from 'react';
import styles from './Card.module.css';

type CardColor = 'white' | 'primary' | 'secondary' | 'accent' | 'muted';

interface CardProps {
  children: ReactNode;
  color?: CardColor;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card = ({
  children,
  color = 'white',
  className = '',
  onClick,
  hoverable = false,
}: CardProps) => {
  return (
    <div
      className={`${styles.card} ${styles[color]} ${hoverable ? styles.hoverable : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};
