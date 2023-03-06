import {
  isAny,
  isBoolean,
  isLiteral,
  isLiteralOf,
  isNumber,
  isOptional,
  isRecordOf,
  isString,
  isSymbol,
  isTemplateLiteralOf,
  isUnionOf,
  record,
} from '../lib';

test('isRecordOf', () => {
  expect(isRecordOf).toEqual(record);

  expect(isRecordOf(isString)({})).toBe(true);
  expect(isRecordOf(isString)({ abc: 'def' })).toBe(true);
  expect(isRecordOf(isSymbol, isString)({ [Symbol()]: 'abc' })).toBe(true);
  expect(isRecordOf(isNumber, isString)({ 1: 'abc' })).toBe(true);
  expect(isRecordOf(isLiteral('abc'), isString)({ abc: 'def' })).toBe(true);
  expect(isRecordOf(isLiteral(1), isString)({ 1: 'abc' })).toBe(true);
  expect(
    isRecordOf(isLiteralOf(['abc', 1]), isString)({ 1: 'a', abc: 'def' })
  ).toBe(true);
  expect(
    isRecordOf(isTemplateLiteralOf(['a', isNumber]), isString)({ a0: 'abc' })
  ).toBe(true);
  expect(
    isRecordOf(
      isTemplateLiteralOf([isLiteralOf(['a', 'b']), isNumber]),
      isString
    )({ b0: 'abc' })
  ).toBe(true);
  expect(
    isRecordOf(
      isTemplateLiteralOf([
        isTemplateLiteralOf([isLiteralOf(['a', 'b']), isNumber]),
        isNumber,
      ]),
      isString
    )({ b00: 'abc' })
  ).toBe(true);
  expect(
    isRecordOf(
      isTemplateLiteralOf([
        isUnionOf([isLiteral('a'), isLiteral('b')]),
        isNumber,
      ]),
      isString
    )({ b0: 'abc' })
  ).toBe(true);
  expect(
    isRecordOf(isUnionOf([isNumber, isString]), isString)({ abc: 'def' })
  ).toBe(true);
  expect(
    isRecordOf(
      isUnionOf([isLiteral('a'), isLiteral('b')]),
      isString
    )({ a: 'a', b: 'b' })
  ).toBe(true);
  expect(
    isRecordOf(
      isUnionOf([isLiteral('a'), isLiteralOf(['b', 'c']), isString]),
      isString
    )({ a: 'a', b: 'b', c: 'c' })
  ).toBe(true);

  expect(isRecordOf(isString)({ abc: 1 })).toBe(false);
  expect(isRecordOf(isString)({ [Symbol()]: 1 })).toBe(false);
  expect(isRecordOf(isString)(null)).toBe(false);
  expect(isRecordOf(isNumber, isString)({ a: 'abc' })).toBe(false);
  expect(isRecordOf(isUnionOf([isLiteral(1), isString]), isString)({})).toBe(
    false
  );
  expect(
    isRecordOf(isUnionOf([isLiteral(1), isString, isSymbol]), isString)({})
  ).toBe(false);

  expect(() => {
    // @ts-expect-error - Expect throw
    isRecordOf();
  }).toThrow;

  expect(() => {
    // @ts-expect-error - Expect throw
    isRecordOf(isOptional(isString), isString);
  }).toThrow;

  expect(() => {
    isRecordOf(isOptional(isString));
  }).toThrow(TypeError('Optional type cannot be used in record declaration'));

  expect(() => {
    isRecordOf(isAny, isString);
  }).toThrow(TypeError('Invalid type guard for record keys'));

  expect(() => {
    // @ts-expect-error - Expect throw
    isRecordOf(isBoolean, isString);
  }).toThrow(TypeError('Invalid type guard for record keys'));
});
