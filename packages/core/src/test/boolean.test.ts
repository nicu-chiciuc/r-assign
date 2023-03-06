import { boolean, isBoolean } from '../lib/boolean';

test('isBoolean', () => {
  expect(isBoolean).toBe(boolean);

  expect(isBoolean()).toBe(false);
  expect(isBoolean(false)).toBe(true);
  expect(isBoolean(true)).toBe(true);
});
