import { isUndefined, undef } from '../lib/undefined';

test('isUndefined', () => {
  expect(isUndefined).toBe(undef);

  // @ts-expect-error - Expect 1 argument
  expect(isUndefined()).toBeTruthy();
  expect(isUndefined(null)).toBeFalsy();
});
