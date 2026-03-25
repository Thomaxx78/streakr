import { useAuthListener } from '@/features/auth';
import { QueryProvider } from './providers/QueryProvider';
import { AppRouter } from './router/AppRouter';
import './styles/globals.css';

export const App = () => {
  useAuthListener();

  return (
    <QueryProvider>
      <AppRouter />
    </QueryProvider>
  );
};
