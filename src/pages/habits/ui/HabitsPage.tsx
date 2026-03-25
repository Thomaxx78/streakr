import { Card, Badge } from '@/shared/ui';
import styles from './HabitsPage.module.css';

export const HabitsPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Mes Habitudes</h1>
        <Badge variant="purple">Commit 2</Badge>
      </div>
      <Card color="muted">
        <p className={styles.placeholder}>
          🚧 Le CRUD complet des habitudes arrive dans le prochain commit !
        </p>
      </Card>
    </div>
  );
};
