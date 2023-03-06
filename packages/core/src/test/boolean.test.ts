import { boolean, isBoolean } from '../lib/boolean';

test('isBoolean', () => {
  expect(isBoolean).toBe(boolean);

  expect(isBoolean()).toBeFalsy();
  expect(isBoolean(false)).toBeTruthy();
  expect(isBoolean(true)).toBeTruthy();
});
