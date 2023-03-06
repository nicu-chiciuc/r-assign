import { anyNumber, isAnyNumber, isNumber, number } from '../lib/number';

test('isAnyNumber', () => {
  expect(isAnyNumber).toEqual(anyNumber);

  // @ts-expect-error - Expect 1 argument
  expect(isAnyNumber()).toBeFalsy();
  expect(isAnyNumber(NaN)).toBeTruthy();
  expect(isAnyNumber(Infinity)).toBeTruthy();
  expect(isAnyNumber(-Infinity)).toBeTruthy();
  expect(isNumber(0)).toBeTruthy();
});

test('isNumber', () => {
  expect(isNumber).toEqual(number);

  // @ts-expect-error - Expect 1 argument
  expect(isNumber()).toBeFalsy();
  expect(isNumber(NaN)).toBeFalsy();
  expect(isNumber(Infinity)).toBeFalsy();
  expect(isNumber(-Infinity)).toBeFalsy();
  expect(isNumber(0)).toBeTruthy();
});
