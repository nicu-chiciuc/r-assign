import { isUndefined, undef } from '../lib/undefined';

test('isUndefined', () => {
  expect(isUndefined).toBe(undef);

  expect(isUndefined()).toBeTruthy();
  expect(isUndefined(null)).toBeFalsy();
});
