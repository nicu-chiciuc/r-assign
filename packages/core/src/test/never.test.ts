import { isNever, never } from '../lib/never';

test('isNever', () => {
  expect(isNever).toEqual(never);

  // @ts-expect-error - Expects 1 argument
  expect(isNever()).toBe(false);

  expect(isNever(null)).toBe(false);
});
