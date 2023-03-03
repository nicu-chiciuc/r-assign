import { test, equal, notOk, ok, throws } from 'tap';
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

  equal(getNullLiteral(), null);
  equal(getNullLiteral(null), null);
  equal(getNullLiteral(0), null);

  throws(() => {
    // @ts-expect-error
    getLiteral({});
  }, TypeError('Invalid literal provided'));
});

test('getLiteralOf', () => {
  const getLiteralAB = getLiteralOf(['a', 'b'], 'a');

  equal(getLiteralAB(), 'a');
  equal(getLiteralAB('b'), 'b');
  equal(getLiteralAB(0), 'a');

  const getLiteralBA = getLiteralOf(['a', 'b'], 'b');

  equal(getLiteralBA(), 'b');
  equal(getLiteralBA('a'), 'a');
  equal(getLiteralBA(0), 'b');

  throws(() => {
    // @ts-expect-error
    getLiteralOf();
  }, TypeError('Invalid literals provided'));

  throws(() => {
    // @ts-expect-error
    getLiteralOf([{}, {}]);
  }, TypeError('Invalid literal provided'));

  throws(() => {
    // @ts-expect-error
    getLiteralOf(['a', 'b'], null);
  }, TypeError(`${invalidDefaultValue}, ${expectedLiterals} ${received}`));
});

test('isLiteral', () => {
  equal(isLiteral, literal);

  ok(isLiteral(null)(null));
  ok(isLiteral(0n)(0n));
  ok(isLiteral(false)(false));
  ok(isLiteral(0)(0));
  ok(isLiteral('')(''));
  notOk(isLiteral(0)());

  throws(() => {
    // @ts-expect-error
    isLiteral({});
  }, TypeError('Invalid literal provided'));

  throws(() => {
    isLiteral(Infinity);
  }, TypeError('Invalid literal provided'));

  throws(() => {
    // @ts-expect-error
    isLiteral(() => null);
  }, TypeError('Invalid literal provided'));
});

test('isLiteralOf', () => {
  equal(isLiteralOf, literals);

  ok(isLiteralOf(['a'])('a'));
  ok(isLiteralOf(['a', 'b'])('a'));
  notOk(isLiteralOf(['a', 'b'])(0));

  throws(() => {
    // @ts-expect-error
    isLiteralOf();
  }, TypeError('Invalid literals provided'));

  throws(() => {
    // @ts-expect-error
    isLiteralOf([]);
  }, TypeError('Not enough literals, at least one expected'));

  throws(() => {
    isLiteralOf(['a', 'a']);
  }, TypeError('Duplicate literal provided'));
});

test('parseLiteral', () => {
  const parseLiteralFalse = parseLiteral(false);

  equal(parseLiteralFalse(false), false);

  throws(() => {
    parseLiteralFalse(null);
  }, TypeError(`${invalidValue}, ${expectedFalse} ${received}`));

  throws(() => {
    parseLiteralFalse('false');
  }, TypeError(`${invalidValue}, ${expectedFalse} ${receivedStringFalse}`));
});

test('parseLiteralOf', () => {
  const parseLiteralAB = parseLiteralOf(['a', 'b']);

  equal(parseLiteralAB('a'), 'a');

  throws(() => {
    parseLiteralAB(null);
  }, TypeError(`${invalidValue}, ${expectedLiterals} ${received}`));
});
