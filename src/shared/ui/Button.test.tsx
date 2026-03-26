import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('devrait afficher le texte enfant', () => {
    render(<Button>Cliquer ici</Button>);
    expect(screen.getByRole('button', { name: 'Cliquer ici' })).toBeInTheDocument();
  });

  it('devrait appeler onClick au clic', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Cliquer</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('devrait être disabled quand isLoading est true', () => {
    render(<Button isLoading>Chargement</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('devrait afficher le spinner quand isLoading', () => {
    const { container } = render(<Button isLoading>Chargement</Button>);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
