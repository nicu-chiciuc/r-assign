import { isString, string } from '../lib/string';

test('isString', () => {
  expect(isString).toEqual(string);

  // @ts-expect-error isString should receive a value
  expect(isString()).toBeFalsy();

  expect(isString('')).toBeTruthy();
});
