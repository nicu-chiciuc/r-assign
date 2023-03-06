import { isLiteral, isLiteralOf, literal, literals } from '../lib/literal';

const expectedFalse = 'expected false literal';
const expectedLiterals = 'expected a union of literals "a" | "b"';
const invalidDefaultValue = 'Invalid default value type';
const invalidValue = 'Invalid value type';
const received = 'but received null';
const receivedStringFalse = 'but received "false"';

test('isLiteral', () => {
  expect(isLiteral).toEqual(literal);

  expect(isLiteral(null)(null)).toBe(true);
  expect(isLiteral(0n)(0n)).toBe(true);
  expect(isLiteral(false)(false)).toBe(true);
  expect(isLiteral(0)(0)).toBe(true);
  expect(isLiteral('')('')).toBe(true);
  // @ts-expect-error - Expect 1 argument
  expect(isLiteral(0)()).toBe(false);

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

  expect(isLiteralOf(['a'])('a')).toBe(true);
  expect(isLiteralOf(['a', 'b'])('a')).toBe(true);
  expect(isLiteralOf(['a', 'b'])(0)).toBe(false);

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
