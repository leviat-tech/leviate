import { useEnum } from '../../core/composables/useEnum';


describe('useEnum', () => {
  it('should accept an array as a single parameter', () => {
    const theme = useEnum(['LIGHT', 'DARK']);

    expect(theme).toEqual(['LIGHT', 'DARK']);
  });

  it('should accept multiple strings as parameters', () => {
    const theme = useEnum('LIGHT', 'DARK');

    expect(theme).toEqual(['LIGHT', 'DARK']);
  });

  it('should access items by their index', () => {
    const theme = useEnum('LIGHT', 'DARK');

    expect(theme[0]).toBe('LIGHT');
    expect(theme[1]).toBe('DARK');
  });

  it('should access items by their property name', () => {
    const theme = useEnum('LIGHT', 'DARK');

    expect(theme.LIGHT).toBe('LIGHT');
    expect(theme.DARK).toBe('DARK');
  });

  it('should throw when attempting to reassign an index', () => {
    const theme = useEnum('LIGHT', 'DARK');

    const action = () => theme[1] = 'LIGHT';

    expect(action).toThrowError();
    expect(theme.DARK).toBe('DARK');
  });

  it('should throw when attempting to reassign a property', () => {
    const theme = useEnum('LIGHT', 'DARK');

    const action = () => theme.DARK = 'LIGHT';

    expect(action).toThrowError();
    expect(theme.DARK).toBe('DARK');
  });

  it('should return the items as lowercase values', () => {
    const theme = useEnum('LIGHT', 'DARK');

    expect(theme.lower).toEqual(['light', 'dark']);
  });

  it('should enable getters on lowercase enum', () => {
    const theme = useEnum('LIGHT', 'DARK');

    expect(theme.lower.light).toBe('light');
    expect(theme.lower.LIGHT).toBe(undefined);
  });

  it('should return the items as uppercase', () => {
    const theme = useEnum('light', 'dark');

    expect(theme.upper).toEqual(['LIGHT', 'DARK']);
  });

  it('should enable getters on uppercase enum', () => {
    const theme = useEnum('light', 'dark');

    expect(theme.upper.light).toBe(undefined);
    expect(theme.upper.LIGHT).toBe('LIGHT');
  });

  it('should compare an item with a given value', () => {
    const theme = useEnum('LIGHT', 'DARK');

    expect(theme.is.LIGHT('LIGHT')).toBe(true);
    expect(theme.is.LIGHT('DARK')).toBe(false);
    expect(theme.is.DARK('DARK')).toBe(true);
    expect(theme.is.DARK('LIGHT')).toBe(false);
  });

  it('should validate a specified value', () => {
    const theme = useEnum('LIGHT', 'DARK');

    expect(theme.isValid('LIGHT')).toBe(true);
    expect(theme.isValid('BLUE')).toBe(false);
  });
});