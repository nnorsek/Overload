import { sessionColor } from '../session.utils';
import type { SessionStatus } from '../../types/Session';

describe('sessionColor', () => {
  it('returns green classes for "Confirmed" status', () => {
    expect(sessionColor('Confirmed')).toEqual({
      base: 'bg-green-500',
      hover: 'hover:bg-green-500/80',
    });
  });

  it('returns yellow classes for "Pending" status', () => {
    expect(sessionColor('Pending')).toEqual({
      base: 'bg-yellow-500',
      hover: 'hover:bg-yellow-500/80',
    });
  });

  it('returns red classes for "Cancelled" status', () => {
    expect(sessionColor('Cancelled')).toEqual({
      base: 'bg-red-500',
      hover: 'hover:bg-red-500/80',
    });
  });

  it('returns blue classes for "Completed" status', () => {
    expect(sessionColor('Completed')).toEqual({
      base: 'bg-blue-500',
      hover: 'hover:bg-blue-500/80',
    });
  });

  it('returns gray classes for an unknown/default status', () => {
    // Cast to SessionStatus to exercise the default branch
    const result = sessionColor('Unknown' as SessionStatus);
    expect(result).toEqual({
      base: 'bg-gray-500',
      hover: 'hover:bg-gray-500/80',
    });
  });

  it('each valid status returns a non-gray base color', () => {
    const validStatuses: SessionStatus[] = ['Confirmed', 'Pending', 'Cancelled', 'Completed'];
    for (const status of validStatuses) {
      const { base } = sessionColor(status);
      expect(base).not.toBe('bg-gray-500');
    }
  });
});
