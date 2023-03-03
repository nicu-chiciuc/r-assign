import { isNever, never } from '../lib/never';

test('isNever', () => {
  expect(isNever).toEqual(never);

  expect(isNever()).toBeFalsy();
  expect(isNever(null)).toBeFalsy();
});
