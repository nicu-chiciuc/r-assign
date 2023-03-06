import { anyNumber, isAnyNumber, isNumber, number } from '../lib/number';

test('isAnyNumber', () => {
  expect(isAnyNumber).toEqual(anyNumber);

  // @ts-expect-error - Expect 1 argument
  expect(isAnyNumber()).toBe(false);
  expect(isAnyNumber(NaN)).toBe(true);
  expect(isAnyNumber(Infinity)).toBe(true);
  expect(isAnyNumber(-Infinity)).toBe(true);
  expect(isNumber(0)).toBe(true);
});

test('isNumber', () => {
  expect(isNumber).toEqual(number);

  // @ts-expect-error - Expect 1 argument
  expect(isNumber()).toBe(false);
  expect(isNumber(NaN)).toBe(false);
  expect(isNumber(Infinity)).toBe(false);
  expect(isNumber(-Infinity)).toBe(false);
  expect(isNumber(0)).toBe(true);
});
