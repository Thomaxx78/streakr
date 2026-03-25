import { Card, Badge } from '@/shared/ui';

export const ProfilePage = () => {
  return (
    <div style={{ padding: 'var(--space-xl)', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
        <h1>Profil & Paramètres</h1>
        <Badge variant="purple">Commit 3</Badge>
      </div>
      <Card color="muted">
        <p style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: '#666' }}>
          ⚙️ La page profil arrive dans le dernier commit !
        </p>
      </Card>
    </div>
  );
};
