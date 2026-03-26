import { Outlet } from 'react-router-dom';
import { Header } from '@/widgets/header';
import { Sidebar } from '@/widgets/sidebar';
import { ToastContainer } from '@/shared/ui';
import { useUIStore } from '@/shared/lib';
import styles from './AppLayout.module.css';

export const AppLayout = () => {
  const accentColor = useUIStore((s) => s.accentColor);

  return (
    <div className={styles.layout} style={{ '--color-primary': accentColor } as React.CSSProperties}>
      <Header />
      <Sidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  );
};
