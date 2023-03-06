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

  expect(isTemplateLiteralOf([])('')).toBe(true);
  expect(isTemplateLiteralOf([''])('')).toBe(true);
  expect(isTemplateLiteralOf([true])('true')).toBe(true);
  expect(isTemplateLiteralOf([0])('0')).toBe(true);
  expect(isTemplateLiteralOf(['abc'])('abc')).toBe(true);
  expect(isTemplateLiteralOf(['abc', 'def'])('abcdef')).toBe(true);
  expect(isTemplateLiteralOf([isAny])('')).toBe(true);
  expect(isTemplateLiteralOf([isAny])('abc')).toBe(true);
  expect(isTemplateLiteralOf([isBigInt])('0')).toBe(true);
  expect(isTemplateLiteralOf([isBoolean])('false')).toBe(true);
  expect(isTemplateLiteralOf([isBoolean])('true')).toBe(true);
  expect(
    isTemplateLiteralOf([isLiteralOf(['a', 'b']), '-', isNumber])('a-0')
  ).toBe(true);
  expect(
    isTemplateLiteralOf([isUnionOf([isBigInt, isString, isNumber])])('0')
  ).toBe(true);
  expect(
    isTemplateLiteralOf([isUnionOf([isLiteral('a'), isLiteral('b')])])('a')
  ).toBe(true);
  expect(
    isTemplateLiteralOf([isUnionOf([isNumber, isLiteralOf(['a', 'b'])])])('a')
  ).toBe(true);
  expect(
    isTemplateLiteralOf([
      isUnionOf([isNumber, isTemplateLiteralOf(['a-', isNumber])]),
    ])('a-0')
  ).toBe(true);
  expect(isTemplateLiteralOf([isLiteral('')])('')).toBe(true);
  expect(isTemplateLiteralOf([isLiteral('abc')])('abc')).toBe(true);
  expect(isTemplateLiteralOf([isLiteral(0)])('0')).toBe(true);
  expect(isTemplateLiteralOf([isLiteralOf(['abc', 'def'])])('def')).toBe(true);
  expect(isTemplateLiteralOf([isNullable(isBoolean)])('true')).toBe(true);
  expect(isTemplateLiteralOf([isNullable(isBoolean)])('false')).toBe(true);
  expect(isTemplateLiteralOf([isNullable(isBoolean)])('null')).toBe(true);

  expect(isTemplateLiteralOf([isNumber])('0')).toBe(true);
  expect(isTemplateLiteralOf([isNumber])('0.')).toBe(true);
  expect(isTemplateLiteralOf([isNumber])('.0')).toBe(true);
  expect(isTemplateLiteralOf([isNumber])('0.0')).toBe(true);
  expect(isTemplateLiteralOf([isNumber])('0.0e0')).toBe(true);
  expect(isTemplateLiteralOf([isNumber])('0.0e+0')).toBe(true);
  expect(isTemplateLiteralOf([isNumber])('0.0e-0')).toBe(true);
  expect(isTemplateLiteralOf([isNumber])('0.0E0')).toBe(true);
  expect(isTemplateLiteralOf([isNumber])('0.0E+0')).toBe(true);
  expect(isTemplateLiteralOf([isNumber])('0.0E-0')).toBe(true);
  expect(isTemplateLiteralOf([isNumber])('00.00E-00')).toBe(true);
  expect(isTemplateLiteralOf([isNumber])('+0')).toBe(true);
  expect(isTemplateLiteralOf([isNumber])('+0.')).toBe(true);
  expect(isTemplateLiteralOf([isNumber])('+.0')).toBe(true);
  expect(isTemplateLiteralOf([isNumber])('+0.0')).toBe(true);
  expect(isTemplateLiteralOf([isNumber])('+0.0e0')).toBe(true);
  expect(isTemplateLiteralOf([isNumber])('+0.0e+0')).toBe(true);
  expect(isTemplateLiteralOf([isNumber])('+0.0e-0')).toBe(true);
  expect(isTemplateLiteralOf([isNumber])('+0.0E0')).toBe(true);
  expect(isTemplateLiteralOf([isNumber])('+0.0E+0')).toBe(true);
  expect(isTemplateLiteralOf([isNumber])('+0.0E-0')).toBe(true);
  expect(isTemplateLiteralOf([isNumber])('+00.00E-00')).toBe(true);
  expect(isTemplateLiteralOf([isNumber])('-0')).toBe(true);
  expect(isTemplateLiteralOf([isNumber])('-0.')).toBe(true);
  expect(isTemplateLiteralOf([isNumber])('-.0')).toBe(true);
  expect(isTemplateLiteralOf([isNumber])('-0.0')).toBe(true);
  expect(isTemplateLiteralOf([isNumber])('-0.0e0')).toBe(true);
  expect(isTemplateLiteralOf([isNumber])('-0.0e+0')).toBe(true);
  expect(isTemplateLiteralOf([isNumber])('-0.0e-0')).toBe(true);
  expect(isTemplateLiteralOf([isNumber])('-0.0E0')).toBe(true);
  expect(isTemplateLiteralOf([isNumber])('-0.0E+0')).toBe(true);
  expect(isTemplateLiteralOf([isNumber])('-0.0E-0')).toBe(true);
  expect(isTemplateLiteralOf([isNumber])('-00.00E-00')).toBe(true);
  expect(isTemplateLiteralOf([isNumber])('0b01')).toBe(true);
  expect(isTemplateLiteralOf([isNumber])('0o01234567')).toBe(true);
  expect(isTemplateLiteralOf([isNumber])('0x0123456789ABCDEFabcdef')).toBe(
    true
  );

  expect(isTemplateLiteralOf([isString])('')).toBe(true);
  expect(isTemplateLiteralOf([isString])('abc')).toBe(true);
  expect(isTemplateLiteralOf([isString, isString])('abc')).toBe(true);
  expect(isTemplateLiteralOf([isString, isNumber])('a0')).toBe(true);
  expect(
    isTemplateLiteralOf([isTemplateLiteralOf([isString, 'a']), 'b'])('ab')
  ).toBe(true);
  expect(isTemplateLiteralOf([isUnionOf([isString, isNumber])])('abc')).toBe(
    true
  );
  expect(isTemplateLiteralOf([isUnionOf([isString, isNumber])])('0')).toBe(
    true
  );

  // @ts-expect-error - Expect 1 argument
  expect(isTemplateLiteralOf([])()).toBe(false);
  expect(isTemplateLiteralOf([])(' ')).toBe(false);
  expect(isTemplateLiteralOf(['abc'])('')).toBe(false);
  // @ts-expect-error - Expect 1 argument
  expect(isTemplateLiteralOf([isBoolean])()).toBe(false);
  expect(isTemplateLiteralOf([isBoolean])('')).toBe(false);

  expect(isTemplateLiteralOf([isNumber])('')).toBe(false);
  expect(isTemplateLiteralOf([isNumber])('+')).toBe(false);
  expect(isTemplateLiteralOf([isNumber])('-')).toBe(false);
  expect(isTemplateLiteralOf([isNumber])('.')).toBe(false);
  expect(isTemplateLiteralOf([isNumber])('0.0e')).toBe(false);
  expect(isTemplateLiteralOf([isNumber])('0.0e+')).toBe(false);
  expect(isTemplateLiteralOf([isNumber])('0.0e-')).toBe(false);
  expect(isTemplateLiteralOf([isNumber])('+0b0')).toBe(false);
  expect(isTemplateLiteralOf([isNumber])('+0o0')).toBe(false);
  expect(isTemplateLiteralOf([isNumber])('+0x0')).toBe(false);
  expect(isTemplateLiteralOf([isNumber])('-0b0')).toBe(false);
  expect(isTemplateLiteralOf([isNumber])('-0o0')).toBe(false);
  expect(isTemplateLiteralOf([isNumber])('-0x0')).toBe(false);

  // Check for working escaped characters
  expect(isTemplateLiteralOf([isNumber, '.+'])('0...')).toBe(false);

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
