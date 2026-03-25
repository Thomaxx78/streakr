import { Outlet } from 'react-router-dom';
import { Header } from '@/widgets/header';
import { Sidebar } from '@/widgets/sidebar';
import styles from './AppLayout.module.css';

export const AppLayout = () => {
  return (
    <div className={styles.layout}>
      <Header />
      <Sidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};
