import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ListChecks, BarChart3, UserCog, X, Flame, Focus } from 'lucide-react';
import { useUIStore } from '@/shared/lib/useUIStore';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/habits', label: 'Mes Habitudes', icon: ListChecks },
  { to: '/stats', label: 'Statistiques', icon: BarChart3 },
  { to: '/profile', label: 'Profil', icon: UserCog },
  { to: '/focus', label: 'Mode Focus', icon: Focus },
] as const;

export const Sidebar = () => {
  const isOpen = useUIStore((s) => s.isSidebarOpen);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);

  return (
    <>
      {isOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.closeRow}>
          <button
            className={styles.closeBtn}
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.footer}>
          <div className={styles.footerCard}>
            <Flame size={22} className={styles.footerEmoji} />
            <p className={styles.footerText}>Continue ton streak !</p>
          </div>
        </div>
      </aside>
    </>
  );
};
