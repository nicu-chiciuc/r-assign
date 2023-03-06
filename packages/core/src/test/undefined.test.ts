import { isUndefined, undef } from '../lib/undefined';

test('isUndefined', () => {
  expect(isUndefined).toBe(undef);

  // @ts-expect-error - Expect 1 argument
  expect(isUndefined()).toBe(true);
  expect(isUndefined(null)).toBe(false);
});
