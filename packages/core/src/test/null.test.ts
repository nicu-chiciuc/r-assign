import {
  isNull,
  isNullable,
  isNullish,
  isOptional,
  isString,
  nullable,
  nulled,
  nullish,
} from '../lib';

test('isNull', () => {
  expect(isNull).toEqual(nulled);

  expect(isNull(null)).toBeTruthy();

  // @ts-expect-error - Expects 1 argument
  expect(isNull()).toBeFalsy();
});

test('isNullable', () => {
  const isNullableString = isNullable(isString);

  expect(isNullable).toEqual(nullable);

  expect(isNullableString(null)).toBeTruthy();
  expect(isNullableString('')).toBeTruthy();

  // @ts-expect-error - Expects 1 argument
  expect(isNullableString()).toBeFalsy();

  expect(() => {
    // @ts-expect-error - Throws
    isNullable();
  }).toThrow(TypeError('Invalid type guard provided'));

  expect(() => {
    // @ts-expect-error - Throws
    isNullable(isOptional(isString));
  }).toThrow(TypeError('Optional type cannot be used in union declaration'));
});

test('isNullish', () => {
  const isNullishString = isNullish(isString);

  expect(isNullish).toEqual(nullish);

  expect(isNullishString(null)).toBeTruthy();
  // @ts-expect-error - Expects 1 argument
  expect(isNullishString()).toBeTruthy();
  expect(isNullishString('')).toBeTruthy();
  expect(isNullishString(true)).toBeFalsy();

  expect(() => {
    // @ts-expect-error - Throws
    isNullish();
  }).toThrow(TypeError('Invalid type guard provided'));

  expect(() => {
    // @ts-expect-error - Throws
    isNullish(isOptional(isString));
  }).toThrow(TypeError('Optional type cannot be used in union declaration'));
});
