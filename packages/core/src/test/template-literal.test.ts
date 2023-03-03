import {
  isAny,
  isArrayOf,
  isBigInt,
  isBoolean,
  isIntersectionOf,
  isLiteral,
  isLiteralOf,
  isNullable,
  isNumber,
  isObjectOf,
  isOptional,
  isString,
  isSymbol,
  isTemplateLiteralOf,
  isUnionOf,
  templateLiteral,
} from '../lib';

const declaration = 'template literal declaration';

test('isTemplateLiteralOf', () => {
  expect(isTemplateLiteralOf).toEqual(templateLiteral);

  expect(isTemplateLiteralOf([])('')).toBeTruthy();
  expect(isTemplateLiteralOf([''])('')).toBeTruthy();
  expect(isTemplateLiteralOf([true])('true')).toBeTruthy();
  expect(isTemplateLiteralOf([0])('0')).toBeTruthy();
  expect(isTemplateLiteralOf(['abc'])('abc')).toBeTruthy();
  expect(isTemplateLiteralOf(['abc', 'def'])('abcdef')).toBeTruthy();
  expect(isTemplateLiteralOf([isAny])('')).toBeTruthy();
  expect(isTemplateLiteralOf([isAny])('abc')).toBeTruthy();
  expect(isTemplateLiteralOf([isBigInt])('0')).toBeTruthy();
  expect(isTemplateLiteralOf([isBoolean])('false')).toBeTruthy();
  expect(isTemplateLiteralOf([isBoolean])('true')).toBeTruthy();
  expect(
    isTemplateLiteralOf([isLiteralOf(['a', 'b']), '-', isNumber])('a-0')
  ).toBeTruthy();
  expect(
    isTemplateLiteralOf([isUnionOf([isBigInt, isString, isNumber])])('0')
  ).toBeTruthy();
  expect(
    isTemplateLiteralOf([isUnionOf([isLiteral('a'), isLiteral('b')])])('a')
  ).toBeTruthy();
  expect(
    isTemplateLiteralOf([isUnionOf([isNumber, isLiteralOf(['a', 'b'])])])('a')
  ).toBeTruthy();
  expect(
    isTemplateLiteralOf([
      isUnionOf([isNumber, isTemplateLiteralOf(['a-', isNumber])]),
    ])('a-0')
  ).toBeTruthy();
  expect(isTemplateLiteralOf([isLiteral('')])('')).toBeTruthy();
  expect(isTemplateLiteralOf([isLiteral('abc')])('abc')).toBeTruthy();
  expect(isTemplateLiteralOf([isLiteral(0)])('0')).toBeTruthy();
  expect(
    isTemplateLiteralOf([isLiteralOf(['abc', 'def'])])('def')
  ).toBeTruthy();
  expect(isTemplateLiteralOf([isNullable(isBoolean)])('true')).toBeTruthy();
  expect(isTemplateLiteralOf([isNullable(isBoolean)])('false')).toBeTruthy();
  expect(isTemplateLiteralOf([isNullable(isBoolean)])('null')).toBeTruthy();

  expect(isTemplateLiteralOf([isNumber])('0')).toBeTruthy();
  expect(isTemplateLiteralOf([isNumber])('0.')).toBeTruthy();
  expect(isTemplateLiteralOf([isNumber])('.0')).toBeTruthy();
  expect(isTemplateLiteralOf([isNumber])('0.0')).toBeTruthy();
  expect(isTemplateLiteralOf([isNumber])('0.0e0')).toBeTruthy();
  expect(isTemplateLiteralOf([isNumber])('0.0e+0')).toBeTruthy();
  expect(isTemplateLiteralOf([isNumber])('0.0e-0')).toBeTruthy();
  expect(isTemplateLiteralOf([isNumber])('0.0E0')).toBeTruthy();
  expect(isTemplateLiteralOf([isNumber])('0.0E+0')).toBeTruthy();
  expect(isTemplateLiteralOf([isNumber])('0.0E-0')).toBeTruthy();
  expect(isTemplateLiteralOf([isNumber])('00.00E-00')).toBeTruthy();
  expect(isTemplateLiteralOf([isNumber])('+0')).toBeTruthy();
  expect(isTemplateLiteralOf([isNumber])('+0.')).toBeTruthy();
  expect(isTemplateLiteralOf([isNumber])('+.0')).toBeTruthy();
  expect(isTemplateLiteralOf([isNumber])('+0.0')).toBeTruthy();
  expect(isTemplateLiteralOf([isNumber])('+0.0e0')).toBeTruthy();
  expect(isTemplateLiteralOf([isNumber])('+0.0e+0')).toBeTruthy();
  expect(isTemplateLiteralOf([isNumber])('+0.0e-0')).toBeTruthy();
  expect(isTemplateLiteralOf([isNumber])('+0.0E0')).toBeTruthy();
  expect(isTemplateLiteralOf([isNumber])('+0.0E+0')).toBeTruthy();
  expect(isTemplateLiteralOf([isNumber])('+0.0E-0')).toBeTruthy();
  expect(isTemplateLiteralOf([isNumber])('+00.00E-00')).toBeTruthy();
  expect(isTemplateLiteralOf([isNumber])('-0')).toBeTruthy();
  expect(isTemplateLiteralOf([isNumber])('-0.')).toBeTruthy();
  expect(isTemplateLiteralOf([isNumber])('-.0')).toBeTruthy();
  expect(isTemplateLiteralOf([isNumber])('-0.0')).toBeTruthy();
  expect(isTemplateLiteralOf([isNumber])('-0.0e0')).toBeTruthy();
  expect(isTemplateLiteralOf([isNumber])('-0.0e+0')).toBeTruthy();
  expect(isTemplateLiteralOf([isNumber])('-0.0e-0')).toBeTruthy();
  expect(isTemplateLiteralOf([isNumber])('-0.0E0')).toBeTruthy();
  expect(isTemplateLiteralOf([isNumber])('-0.0E+0')).toBeTruthy();
  expect(isTemplateLiteralOf([isNumber])('-0.0E-0')).toBeTruthy();
  expect(isTemplateLiteralOf([isNumber])('-00.00E-00')).toBeTruthy();
  expect(isTemplateLiteralOf([isNumber])('0b01')).toBeTruthy();
  expect(isTemplateLiteralOf([isNumber])('0o01234567')).toBeTruthy();
  expect(
    isTemplateLiteralOf([isNumber])('0x0123456789ABCDEFabcdef')
  ).toBeTruthy();

  expect(isTemplateLiteralOf([isString])('')).toBeTruthy();
  expect(isTemplateLiteralOf([isString])('abc')).toBeTruthy();
  expect(isTemplateLiteralOf([isString, isString])('abc')).toBeTruthy();
  expect(isTemplateLiteralOf([isString, isNumber])('a0')).toBeTruthy();
  expect(
    isTemplateLiteralOf([isTemplateLiteralOf([isString, 'a']), 'b'])('ab')
  ).toBeTruthy();
  expect(
    isTemplateLiteralOf([isUnionOf([isString, isNumber])])('abc')
  ).toBeTruthy();
  expect(
    isTemplateLiteralOf([isUnionOf([isString, isNumber])])('0')
  ).toBeTruthy();

  expect(isTemplateLiteralOf([])()).toBeFalsy();
  expect(isTemplateLiteralOf([])(' ')).toBeFalsy();
  expect(isTemplateLiteralOf(['abc'])('')).toBeFalsy();
  expect(isTemplateLiteralOf([isBoolean])()).toBeFalsy();
  expect(isTemplateLiteralOf([isBoolean])('')).toBeFalsy();

  expect(isTemplateLiteralOf([isNumber])('')).toBeFalsy();
  expect(isTemplateLiteralOf([isNumber])('+')).toBeFalsy();
  expect(isTemplateLiteralOf([isNumber])('-')).toBeFalsy();
  expect(isTemplateLiteralOf([isNumber])('.')).toBeFalsy();
  expect(isTemplateLiteralOf([isNumber])('0.0e')).toBeFalsy();
  expect(isTemplateLiteralOf([isNumber])('0.0e+')).toBeFalsy();
  expect(isTemplateLiteralOf([isNumber])('0.0e-')).toBeFalsy();
  expect(isTemplateLiteralOf([isNumber])('+0b0')).toBeFalsy();
  expect(isTemplateLiteralOf([isNumber])('+0o0')).toBeFalsy();
  expect(isTemplateLiteralOf([isNumber])('+0x0')).toBeFalsy();
  expect(isTemplateLiteralOf([isNumber])('-0b0')).toBeFalsy();
  expect(isTemplateLiteralOf([isNumber])('-0o0')).toBeFalsy();
  expect(isTemplateLiteralOf([isNumber])('-0x0')).toBeFalsy();

  // Check for working escaped characters
  expect(isTemplateLiteralOf([isNumber, '.+'])('0...')).toBeFalsy();

  expect(() => {
    // @ts-expect-error - Expect throw
    isTemplateLiteralOf();
  }).toThrow(TypeError('Invalid template literal provided'));

  expect(() => {
    // @ts-expect-error - Expect throw
    isTemplateLiteralOf([isSymbol]);
  }).toThrow(TypeError('Invalid type for template literal type'));

  expect(() => {
    // @ts-expect-error - Expect throw
    isTemplateLiteralOf([isArrayOf(isString)]);
  }).toThrow(TypeError('Invalid type for template literal type'));

  expect(() => {
    isTemplateLiteralOf([
      // @ts-expect-error - Expect throw
      isIntersectionOf([
        isObjectOf({
          a: isNumber,
        }),
        isObjectOf({
          b: isString,
        }),
      ]),
    ]);
  }).toThrow(TypeError('Invalid type for template literal type'));

  expect(() => {
    // @ts-expect-error - Expect throw
    isTemplateLiteralOf([isUnionOf([isSymbol, isString])]);
  }).toThrow(TypeError('Invalid type for template literal type'));

  expect(() => {
    // @ts-expect-error - Expect throw
    isTemplateLiteralOf([isUnionOf([isArrayOf(isString), isString])]);
  }).toThrow(TypeError('Invalid type for template literal type'));

  expect(() => {
    isTemplateLiteralOf([isOptional(isString)]);
  }).toThrow(TypeError(`Optional type cannot be used in ${declaration}`));
});
