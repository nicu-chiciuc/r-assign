import { isLiteral, isLiteralOf, literal, literals } from '../lib/literal';

const expectedFalse = 'expected false literal';
const expectedLiterals = 'expected a union of literals "a" | "b"';
const invalidDefaultValue = 'Invalid default value type';
const invalidValue = 'Invalid value type';
const received = 'but received null';
const receivedStringFalse = 'but received "false"';

test('isLiteral', () => {
  expect(isLiteral).toEqual(literal);

  expect(isLiteral(null)(null)).toBeTruthy();
  expect(isLiteral(0n)(0n)).toBeTruthy();
  expect(isLiteral(false)(false)).toBeTruthy();
  expect(isLiteral(0)(0)).toBeTruthy();
  expect(isLiteral('')('')).toBeTruthy();
  // @ts-expect-error - Expect 1 argument
  expect(isLiteral(0)()).toBeFalsy();

  expect(() => {
    // @ts-expect-error - Expect throw
    isLiteral({});
  }).toThrow(TypeError('Invalid literal provided'));

  expect(() => {
    isLiteral(Infinity);
  }).toThrow(TypeError('Invalid literal provided'));

  expect(() => {
    // @ts-expect-error - Expect throw
    isLiteral(() => null);
  }).toThrow(TypeError('Invalid literal provided'));
});

test('isLiteralOf', () => {
  expect(isLiteralOf).toEqual(literals);

  expect(isLiteralOf(['a'])('a')).toBeTruthy();
  expect(isLiteralOf(['a', 'b'])('a')).toBeTruthy();
  expect(isLiteralOf(['a', 'b'])(0)).toBeFalsy();

  expect(() => {
    // @ts-expect-error - Expect throw
    isLiteralOf();
  }).toThrow(TypeError('Invalid literals provided'));

  expect(() => {
    // @ts-expect-error - Expect throw
    isLiteralOf([]);
  }).toThrow(TypeError('Not enough literals, at least one expected'));

  expect(() => {
    isLiteralOf(['a', 'a']);
  }).toThrow(TypeError('Duplicate literal provided'));
});
