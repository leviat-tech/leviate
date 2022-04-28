import checklang from '../../cli/commands/checklang'

import { pressAnyKey } from '../../cli/helpers';

describe('checklang', () => {
  it('should have no matching files', async () => {
    const res = await checklang.run({ silent: true });

    expect(res).toHaveLength(0);
  });

  it('should have one matching file', async () => {
    const res = await checklang.run({ '0': '__mocks__', silent: true });

    expect(res).toHaveLength(1);
  });

  it('should have 2 line matches in the matching file', async () => {
    const res = await checklang.run({ '0': '__mocks__', silent: true });
    const matches = res[0].matches;

    expect(matches).toHaveLength(2)
  });

  it('should have matches on lines 3 and 6', async () => {
    const res = await checklang.run({ '0': '__mocks__', silent: true });
    const matches = res[0].matches;

    expect(matches[0].line).toBe(3);
    expect(matches[1].line).toBe(6);
  });

  it('should not wait for user input', async () => {
    const res = await checklang.run({ '0': '__mocks__', silent: true });

    expect(pressAnyKey).not.toHaveBeenCalled();
  });

  it('should wait for user input', async () => {
    const res = await checklang.run({ '0': '__mocks__', page: true, silent: true });

    expect(pressAnyKey).toHaveBeenCalled();
  });

});
