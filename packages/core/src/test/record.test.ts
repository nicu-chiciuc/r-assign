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

  expect(isRecordOf(isString)({})).toBeTruthy();
  expect(isRecordOf(isString)({ abc: 'def' })).toBeTruthy();
  expect(isRecordOf(isSymbol, isString)({ [Symbol()]: 'abc' })).toBeTruthy();
  expect(isRecordOf(isNumber, isString)({ 1: 'abc' })).toBeTruthy();
  expect(isRecordOf(isLiteral('abc'), isString)({ abc: 'def' })).toBeTruthy();
  expect(isRecordOf(isLiteral(1), isString)({ 1: 'abc' })).toBeTruthy();
  expect(
    isRecordOf(isLiteralOf(['abc', 1]), isString)({ 1: 'a', abc: 'def' })
  ).toBeTruthy();
  expect(
    isRecordOf(isTemplateLiteralOf(['a', isNumber]), isString)({ a0: 'abc' })
  ).toBeTruthy();
  expect(
    isRecordOf(
      isTemplateLiteralOf([isLiteralOf(['a', 'b']), isNumber]),
      isString
    )({ b0: 'abc' })
  ).toBeTruthy();
  expect(
    isRecordOf(
      isTemplateLiteralOf([
        isTemplateLiteralOf([isLiteralOf(['a', 'b']), isNumber]),
        isNumber,
      ]),
      isString
    )({ b00: 'abc' })
  ).toBeTruthy();
  expect(
    isRecordOf(
      isTemplateLiteralOf([
        isUnionOf([isLiteral('a'), isLiteral('b')]),
        isNumber,
      ]),
      isString
    )({ b0: 'abc' })
  ).toBeTruthy();
  expect(
    isRecordOf(isUnionOf([isNumber, isString]), isString)({ abc: 'def' })
  ).toBeTruthy();
  expect(
    isRecordOf(
      isUnionOf([isLiteral('a'), isLiteral('b')]),
      isString
    )({ a: 'a', b: 'b' })
  ).toBeTruthy();
  expect(
    isRecordOf(
      isUnionOf([isLiteral('a'), isLiteralOf(['b', 'c']), isString]),
      isString
    )({ a: 'a', b: 'b', c: 'c' })
  ).toBeTruthy();

  expect(isRecordOf(isString)({ abc: 1 })).toBeFalsy();
  expect(isRecordOf(isString)({ [Symbol()]: 1 })).toBeFalsy();
  expect(isRecordOf(isString)(null)).toBeFalsy();
  expect(isRecordOf(isNumber, isString)({ a: 'abc' })).toBeFalsy();
  expect(
    isRecordOf(isUnionOf([isLiteral(1), isString]), isString)({})
  ).toBeFalsy();
  expect(
    isRecordOf(isUnionOf([isLiteral(1), isString, isSymbol]), isString)({})
  ).toBeFalsy();

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
