import {
  isOptional,
  isOptionalUndefined,
  isString,
  optional,
  optionalUndef,
} from '../lib';

test('isOptional', () => {
  const isOptionalString = isOptional(isString);

  expect(isOptional).toEqual(optional);

  expect(isOptionalString('')).toBe(true);
  // @ts-expect-error - Expect 1 argument
  expect(isOptionalString()).toBe(false);
  expect(isOptionalString(null)).toBe(false);

  expect(() => {
    // @ts-expect-error - Expect throw
    isOptional();
  }).toThrow(TypeError('Invalid type guard provided'));

  expect(() => {
    // @ts-expect-error - Expect throw
    isOptional(isOptional(isString));
  }).toThrow(TypeError('Optional type cannot be wrapped in optional type'));
});

test('isOptionalUndefined', () => {
  const isOptionalString = isOptionalUndefined(isString);

  expect(isOptionalUndefined).toEqual(optionalUndef);

  // @ts-expect-error - Expect 1 argument
  expect(isOptionalString()).toBe(true);
  expect(isOptionalString('')).toBe(true);
  expect(isOptionalString(null)).toBe(false);

  expect(() => {
    // @ts-expect-error - Expect throw
    isOptionalUndefined();
  }).toThrow(TypeError('Invalid type guard provided'));

  expect(() => {
    // @ts-expect-error - Expect throw
    isOptionalUndefined(isOptionalUndefined(isString));
  }).toThrow(TypeError('Optional type cannot be wrapped in optional type'));
});
