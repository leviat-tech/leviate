jest.mock('../../cli/helpers', () => {
  const helpers = jest.requireActual('../../cli/helpers');

  return {
    __esModule: true,
    ...helpers,
    pressAnyKey: jest.fn()
  }
});