import colorFuelScore from './colorFuelScore';

describe('colorFuelScore', () => {
  it('when value is undefined sau null', () => {
    expect(colorFuelScore(undefined)).toBe('text-typography-100');
    expect(colorFuelScore()).toBe('text-typography-100');
    expect(colorFuelScore(null as any)).toBe('text-typography-100');
  });

  it('when value is greater than 10', () => {
    expect(colorFuelScore(11)).toBe('text-error-50');
    expect(colorFuelScore(15)).toBe('text-error-50');
  });

  it('when value is between 8 and 10', () => {
    expect(colorFuelScore(9)).toBe('text-warning-50');
    expect(colorFuelScore(10)).toBe('text-warning-50');
  });

  it('when value is less than or equal to 8', () => {
    expect(colorFuelScore(8)).toBe('text-success-50');
    expect(colorFuelScore(5)).toBe('text-success-50');
    expect(colorFuelScore(0)).toBe('text-success-50');
    expect(colorFuelScore(-3)).toBe('text-success-50');
  });
});
