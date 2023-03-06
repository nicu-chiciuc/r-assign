import { any, isAny } from '../lib/any';

test('isAny', () => {
  expect(isAny).toBe(any);

  // @ts-expect-error - Expects 1 argument
  expect(isAny()).toBeTruthy();

  expect(isAny(null)).toBeTruthy();
});
