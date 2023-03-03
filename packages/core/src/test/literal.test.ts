import {
  getLiteral,
  getLiteralOf,
  isLiteral,
  isLiteralOf,
  literal,
  literals,
  parseLiteral,
  parseLiteralOf,
} from '../lib/literal';

const expectedFalse = 'expected false literal';
const expectedLiterals = 'expected a union of literals "a" | "b"';
const invalidDefaultValue = 'Invalid default value type';
const invalidValue = 'Invalid value type';
const received = 'but received null';
const receivedStringFalse = 'but received "false"';

test('getLiteral', () => {
  const getNullLiteral = getLiteral(null);

  expect(getNullLiteral()).toEqual(null);
  expect(getNullLiteral(null)).toEqual(null);
  expect(getNullLiteral(0)).toEqual(null);

  expect(() => {
    // @ts-expect-error - Expect throw
    getLiteral({});
  }).toThrow(TypeError('Invalid literal provided'));
});

test('getLiteralOf', () => {
  const getLiteralAB = getLiteralOf(['a', 'b'], 'a');

  expect(getLiteralAB()).toEqual('a');
  expect(getLiteralAB('b')).toEqual('b');
  expect(getLiteralAB(0)).toEqual('a');

  const getLiteralBA = getLiteralOf(['a', 'b'], 'b');

  expect(getLiteralBA()).toEqual('b');
  expect(getLiteralBA('a')).toEqual('a');
  expect(getLiteralBA(0)).toEqual('b');

  expect(() => {
    // @ts-expect-error - Expect throw
    getLiteralOf();
  }).toThrow(TypeError('Invalid literals provided'));

  expect(() => {
    // @ts-expect-error - Expect throw
    getLiteralOf([{}, {}]);
  }).toThrow(TypeError('Invalid literal provided'));

  expect(() => {
    // @ts-expect-error - Expect throw
    getLiteralOf(['a', 'b'], null);
  }).toThrow(
    TypeError(`${invalidDefaultValue}, ${expectedLiterals} ${received}`)
  );
});

test('isLiteral', () => {
  expect(isLiteral).toEqual(literal);

  expect(isLiteral(null)(null)).toBeTruthy();
  expect(isLiteral(0n)(0n)).toBeTruthy();
  expect(isLiteral(false)(false)).toBeTruthy();
  expect(isLiteral(0)(0)).toBeTruthy();
  expect(isLiteral('')('')).toBeTruthy();
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

test('parseLiteral', () => {
  const parseLiteralFalse = parseLiteral(false);

  expect(parseLiteralFalse(false)).toEqual(false);

  expect(() => {
    parseLiteralFalse(null);
  }).toThrow(TypeError(`${invalidValue}, ${expectedFalse} ${received}`));

  expect(() => {
    parseLiteralFalse('false');
  }).toThrow(
    TypeError(`${invalidValue}, ${expectedFalse} ${receivedStringFalse}`)
  );
});

test('parseLiteralOf', () => {
  const parseLiteralAB = parseLiteralOf(['a', 'b']);

  expect(parseLiteralAB('a')).toEqual('a');

  expect(() => {
    parseLiteralAB(null);
  }).toThrow(TypeError(`${invalidValue}, ${expectedLiterals} ${received}`));
});
