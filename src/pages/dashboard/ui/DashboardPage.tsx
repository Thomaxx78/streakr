import { Flame, Zap, Trophy, Calendar } from 'lucide-react';
import { Card, Badge } from '@/shared/ui';
import styles from './DashboardPage.module.css';

export const DashboardPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.greeting}>
        <h1>Salut, Streaker ! 👋</h1>
        <p className={styles.subtitle}>Prêt à crush tes habitudes aujourd&apos;hui ?</p>
      </div>

      <div className={styles.statsGrid}>
        <Card color="primary">
          <div className={styles.statCard}>
            <Flame size={32} color="white" />
            <div>
              <span className={styles.statValue}>0</span>
              <span className={styles.statLabel}>Streak actuel</span>
            </div>
          </div>
        </Card>

        <Card color="accent">
          <div className={styles.statCard}>
            <Zap size={32} />
            <div>
              <span className={styles.statValue}>0 XP</span>
              <span className={styles.statLabel}>Points totaux</span>
            </div>
          </div>
        </Card>

        <Card color="secondary">
          <div className={styles.statCard}>
            <Trophy size={32} />
            <div>
              <span className={styles.statValue}>LVL 1</span>
              <span className={styles.statLabel}>Niveau</span>
            </div>
          </div>
        </Card>

        <Card color="muted">
          <div className={styles.statCard}>
            <Calendar size={32} />
            <div>
              <span className={styles.statValue}>0/0</span>
              <span className={styles.statLabel}>Aujourd&apos;hui</span>
            </div>
          </div>
        </Card>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Habitudes du jour</h2>
          <Badge variant="purple">Bientôt</Badge>
        </div>
        <Card color="muted">
          <p className={styles.emptyText}>
            🚧 Les habitudes arrivent dans le prochain commit ! Pour l&apos;instant, explore le dashboard.
          </p>
        </Card>
      </section>
    </div>
  );
};
