import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from './useUIStore';

beforeEach(() => {
  localStorage.clear();
  useUIStore.setState({ isSidebarOpen: false, accentColor: '#FF6B35' });
});

describe('useUIStore', () => {
  it('la sidebar devrait être fermée par défaut', () => {
    const state = useUIStore.getState();
    expect(state.isSidebarOpen).toBe(false);
  });

  it('devrait toggle la sidebar', () => {
    const { toggleSidebar } = useUIStore.getState();
    toggleSidebar();
    expect(useUIStore.getState().isSidebarOpen).toBe(true);
    toggleSidebar();
    expect(useUIStore.getState().isSidebarOpen).toBe(false);
  });

  it('devrait changer la couleur d\'accent', () => {
    const { setAccentColor } = useUIStore.getState();
    setAccentColor('#A855F7');
    expect(useUIStore.getState().accentColor).toBe('#A855F7');
  });
});
