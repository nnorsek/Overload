import { formatDate, formatTime } from '../time.utils';

describe('formatDate', () => {
  it('formats a known ISO date string to "MMM D, YYYY"', () => {
    expect(formatDate('2024-01-15T00:00:00.000Z')).toBe('Jan 15, 2024');
  });

  it('formats a date in December correctly', () => {
    expect(formatDate('2023-12-31T00:00:00.000Z')).toBe('Dec 31, 2023');
  });

  it('formats a date with a single-digit day (no zero-padding)', () => {
    expect(formatDate('2024-03-05T00:00:00.000Z')).toBe('Mar 5, 2024');
  });

  it('formats a date-only ISO string consistently using UTC', () => {
    // A date string without a time part is parsed as UTC midnight per spec
    expect(formatDate('2025-07-04')).toBe('Jul 4, 2025');
  });

  it('formats a date at the start of the year', () => {
    expect(formatDate('2022-01-01T00:00:00.000Z')).toBe('Jan 1, 2022');
  });
});

describe('formatTime', () => {
  it('formats midnight (00:00 UTC) as 12:00 AM', () => {
    expect(formatTime('2024-01-15T00:00:00.000Z')).toBe('12:00 AM');
  });

  it('formats noon (12:00 UTC) as 12:00 PM', () => {
    expect(formatTime('2024-01-15T12:00:00.000Z')).toBe('12:00 PM');
  });

  it('formats a morning time correctly', () => {
    expect(formatTime('2024-01-15T09:30:00.000Z')).toBe('09:30 AM');
  });

  it('formats an afternoon time correctly', () => {
    expect(formatTime('2024-01-15T14:45:00.000Z')).toBe('02:45 PM');
  });

  it('formats 11:59 PM correctly', () => {
    expect(formatTime('2024-01-15T23:59:00.000Z')).toBe('11:59 PM');
  });

  it('zero-pads minutes', () => {
    expect(formatTime('2024-01-15T10:05:00.000Z')).toBe('10:05 AM');
  });
});
