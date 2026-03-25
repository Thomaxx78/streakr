import { Link } from 'react-router-dom';
import { LogOut, Menu, Flame } from 'lucide-react';
import { useAuthStore, logout } from '@/features/auth';
import { useUIStore } from '@/shared/lib/useUIStore';
import { Button, Badge } from '@/shared/ui';
import styles from './Header.module.css';

export const Header = () => {
  const user = useAuthStore((s) => s.user);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  const username =
    (user?.user_metadata as Record<string, unknown> | undefined)?.username as
      | string
      | undefined ?? 'Streaker';

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <Link to="/dashboard" className={styles.logo}>
          <Flame size={28} />
          <span>STREAKR</span>
        </Link>
      </div>

      <div className={styles.right}>
        <Badge variant="accent">LVL 1</Badge>
        <span className={styles.username}>{username}</span>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut size={18} />
        </Button>
      </div>
    </header>
  );
};
