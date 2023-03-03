import { any, getAny, isAny, parseAny } from '../lib/any';

test('getAny', () => {
  expect(getAny()).toBe(undefined);
  expect(getAny(null)).toBe(null);
});

test('isAny', () => {
  expect(isAny).toBe(any);

  expect(isAny()).toBeTruthy();
  expect(isAny(null)).toBeTruthy();
});

test('parseAny', () => {
  expect(parseAny()).toBe(undefined);
  expect(parseAny(null)).toBe(null);
});
