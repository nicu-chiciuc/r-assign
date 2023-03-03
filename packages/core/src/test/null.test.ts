import {
  getNull,
  getNullable,
  isNull,
  isNullable,
  isNullish,
  isOptional,
  isString,
  nullable,
  nulled,
  nullish,
  parseNull,
  parseNullable,
} from '../lib';

const expectedNull = 'expected a null value';
const expectedNullable = 'expected an union of string | null';
const invalidValue = 'Invalid value type';
const received = 'but received undefined';

test('getNull', () => {
  expect(getNull()).toEqual(null);
});

test('getNullable', () => {
  const getNullableString = getNullable(isString);

  expect(getNullableString()).toEqual(null);
  expect(getNullableString('')).toEqual('');
  expect(getNullableString('data')).toEqual('data');
  expect(getNullableString(null)).toEqual(null);

  expect(() => {
    // @ts-expect-error - Throws - Expect throw
    getNullable();
  }).toThrow(TypeError('Invalid type guard provided'));
});

test('isNull', () => {
  expect(isNull).toEqual(nulled);

  expect(isNull(null)).toBeTruthy();
  expect(isNull()).toBeFalsy();
});

test('isNullable', () => {
  const isNullableString = isNullable(isString);

  expect(isNullable).toEqual(nullable);

  expect(isNullableString(null)).toBeTruthy();
  expect(isNullableString('')).toBeTruthy();
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

test('parseNull', () => {
  expect(parseNull(null)).toEqual(null);

  expect(() => {
    parseNull();
  }).toThrow(TypeError(`${invalidValue}, ${expectedNull} ${received}`));
});

test('parseNullable', () => {
  const parseNullableString = parseNullable(isString);

  expect(parseNullableString(null)).toEqual(null);
  expect(parseNullableString('')).toEqual('');

  expect(() => {
    parseNullableString();
  }).toThrow(TypeError(`${invalidValue}, ${expectedNullable} ${received}`));
});
