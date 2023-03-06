import {
  isAny,
  isArrayOf,
  isBoolean,
  isLiteral,
  isLiteralOf,
  isNumber,
  isObjectOf,
  isOptional,
  isString,
  isTemplateLiteralOf,
  isUnionOf,
  union,
} from '../lib';

const expected = 'expected an union of string | number';
const invalidOptionalType = 'Optional type cannot be used in union declaration';
const invalidValue = 'Invalid value type';

test('isUnionOf', () => {
  expect(isUnionOf).toEqual(union);

  expect(isUnionOf([isBoolean, isNumber, isAny])('')).toBe(true);
  expect(isUnionOf([isBoolean, isNumber])(true)).toBe(true);
  expect(isUnionOf([isBoolean, isNumber])(0)).toBe(true);
  expect(isUnionOf([isLiteral('a'), isString])('')).toBe(true);
  expect(isUnionOf([isLiteral('a'), isLiteralOf(['a', 'b'])])('a')).toBe(true);
  expect(isUnionOf([isLiteralOf(['a', 0, 1]), isString])('a')).toBe(true);
  expect(isUnionOf([isLiteralOf(['a', 0]), isString])('a')).toBe(true);
  expect(isUnionOf([isTemplateLiteralOf([isNumber]), isString])('')).toBe(true);

  // TODO: add a check for equivalent types
  expect(isUnionOf([isArrayOf(isBoolean), isArrayOf(isBoolean)])([true])).toBe(
    true
  );

  expect(isUnionOf([isBoolean, isNumber])('')).toBe(false);

  const isBooleanOrNumberOrString = isUnionOf([
    isBoolean,
    isUnionOf([isNumber, isString]),
  ]);

  expect(isBooleanOrNumberOrString(true)).toBe(true);
  expect(isBooleanOrNumberOrString(0)).toBe(true);
  expect(isBooleanOrNumberOrString('')).toBe(true);
  // @ts-expect-error - Expect 1 argument
  expect(isBooleanOrNumberOrString()).toBe(false);

  expect(isUnionOf([isBoolean, isBoolean])).toEqual(isBoolean);

  expect(() => {
    // @ts-expect-error - Expect throw
    isUnionOf();
  }).toThrow(TypeError('Invalid type guards provided'));

  expect(() => {
    // @ts-expect-error - Expect throw
    isUnionOf([]);
  }).toThrow(TypeError('Not enough type guards, at least two expected'));

  expect(() => {
    // @ts-expect-error - Expect throw
    isUnionOf(Array(1 + 1));
  }).toThrow(TypeError('Not enough type guards, at least two expected'));

  expect(() => {
    // @ts-expect-error - Expect throw
    isUnionOf([null, null]);
  }).toThrow(TypeError('Invalid type guard provided'));

  expect(() => {
    isUnionOf([isOptional(isString), isString]);
  }).toThrow(TypeError(invalidOptionalType));
});
