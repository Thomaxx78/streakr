import { Link } from 'react-router-dom';
import { Flame, Zap, Trophy, Target, Check } from 'lucide-react';
import { Button, Card } from '@/shared/ui';
import styles from './LandingPage.module.css';

const FEATURES = [
  {
    icon: Target,
    title: 'Track Daily',
    description: 'Crée tes habitudes et coche-les chaque jour. Simple.',
    color: 'secondary' as const,
  },
  {
    icon: Zap,
    title: 'Gagne du XP',
    description: 'Chaque check-in te rapporte des points. Monte en niveau.',
    color: 'accent' as const,
  },
  {
    icon: Trophy,
    title: 'Débloque des titres',
    description: 'Deviens "Seigneur du Légume" ou "Maître du 5h du mat".',
    color: 'primary' as const,
  },
] as const;

export const LandingPage = () => {
  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <div className={styles.logoRow}>
          <Flame size={28} />
          <span className={styles.logoText}>STREAKR</span>
        </div>
        <div className={styles.topActions}>
          <Link to="/login">
            <Button variant="ghost" size="sm">Se connecter</Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="sm">Commencer</Button>
          </Link>
        </div>
      </header>

      <main className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroTagline}>
            <span className={styles.tag}><Flame size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> HABIT TRACKER GAMIFIÉ</span>
          </div>
          <h1 className={styles.heroTitle}>
            Track tes habitudes.
            <br />
            <span className={styles.heroHighlight}>Débloque des titres absurdes.</span>
          </h1>
          <p className={styles.heroDesc}>
            STREAKR transforme tes routines en jeu. Coche tes habitudes,
            accumule des streaks, monte en niveau et flexe avec des titres
            que personne ne comprendra.
          </p>
          <div className={styles.heroCta}>
            <Link to="/register">
              <Button size="lg">Commencer gratuitement</Button>
            </Link>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.mockCard}>
            <div className={styles.mockHeader}>
              <span><Flame size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Streak: 14 jours</span>
              <span className={styles.mockLevel}>LVL 7</span>
            </div>
            <div className={styles.mockTitle}>
              &ldquo;Seigneur de la Douche Froide&rdquo;
            </div>
            <div className={styles.mockChecks}>
              {['Méditer', 'Sport', 'Lire', 'Coder'].map((h) => (
                <div key={h} className={styles.mockCheck}>
                  <Check size={14} className={styles.checkDone} />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <section className={styles.features}>
        {FEATURES.map(({ icon: Icon, title, description, color }) => (
          <Card key={title} color={color}>
            <div className={styles.featureIcon}>
              <Icon size={32} />
            </div>
            <h3 className={styles.featureTitle}>{title}</h3>
            <p className={styles.featureDesc}>{description}</p>
          </Card>
        ))}
      </section>

      <footer className={styles.footer}>
        <p>
          Built with <Flame size={16} style={{ display: 'inline', verticalAlign: 'middle' }} /> by STREAKR team — 2026
        </p>
      </footer>
    </div>
  );
};
