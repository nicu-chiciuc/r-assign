import { isSymbol, symbol } from '../lib/symbol';

test('isSymbol', () => {
  expect(isSymbol).toEqual(symbol);

  // @ts-expect-error - Expect 1 argument
  expect(isSymbol()).toBe(false);
  expect(isSymbol(Symbol())).toBe(true);
});
