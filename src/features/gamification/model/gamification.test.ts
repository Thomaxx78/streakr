import { describe, it, expect } from 'vitest';
import { calculateLevel, calculateTitle } from './useGamificationStore';

describe('calculateLevel', () => {
  it('devrait retourner 1 pour 0 XP', () => {
    expect(calculateLevel(0)).toBe(1);
  });

  it('devrait retourner 2 pour 100 XP', () => {
    expect(calculateLevel(100)).toBe(2);
  });

  it('devrait retourner 11 pour 1000 XP', () => {
    expect(calculateLevel(1000)).toBe(11);
  });
});

describe('calculateTitle', () => {
  it('devrait retourner "Débutant Motivé" pour level 1', () => {
    expect(calculateTitle(1)).toBe('Débutant Motivé');
  });

  it('devrait retourner "Légende Vivante" pour level 10', () => {
    expect(calculateTitle(10)).toBe('Légende Vivante');
  });
});
