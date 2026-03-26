import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('devrait afficher le texte enfant', () => {
    render(<Badge>Super Badge</Badge>);
    expect(screen.getByText('Super Badge')).toBeInTheDocument();
  });

  it('devrait appliquer la classe de variant correcte', () => {
    render(<Badge variant="success">OK</Badge>);
    const badge = screen.getByText('OK');
    expect(badge.className).toContain('success');
  });
});
