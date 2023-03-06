import {
  isAny,
  isBoolean,
  isIntersectionOf,
  isNumber,
  isObjectOf,
  isOptional,
  isString,
} from '../lib';

test('isIntersectionOf', () => {
  expect(isIntersectionOf([isBoolean, isNumber, isAny])('')).toBe(true);

  expect(
    isIntersectionOf([
      isObjectOf({
        number: isNumber,
      }),
      isObjectOf({
        string: isString,
      }),
    ])({ number: 0, string: '' })
  ).toBe(true);

  expect(
    isIntersectionOf([
      isObjectOf({
        boolean: isBoolean,
      }),
      isObjectOf({
        number: isNumber,
      }),
      isObjectOf({
        string: isString,
      }),
    ])({ boolean: false, number: 0, string: '' })
  ).toBe(true);

  expect(
    isIntersectionOf([
      isObjectOf({
        boolean: isBoolean,
      }),
      isObjectOf({
        number: isNumber,
      }),
      isObjectOf({
        string: isString,
      }),
    ])({ boolean: false, number: 0 })
  ).toBe(false);

  expect(() => {
    // @ts-expect-error - Expect throw
    isIntersectionOf();
  }).toThrow(TypeError('Invalid type guards provided'));

  expect(() => {
    // @ts-expect-error - Expect throw
    isIntersectionOf([]);
  }).toThrow(TypeError('Not enough type guards, at least two expected'));

  expect(() => {
    // @ts-expect-error - Expect throw
    isIntersectionOf([null, null]);
  }).toThrow(TypeError('Invalid type guard provided'));

  expect(() => {
    isIntersectionOf([isNumber, isString]);
  }).toThrow(TypeError('Provided intersection is impossible'));

  expect(() => {
    isIntersectionOf([isOptional(isNumber), isString]);
  }).toThrow(
    TypeError('Optional type cannot be used in intersection declaration')
  );
});
