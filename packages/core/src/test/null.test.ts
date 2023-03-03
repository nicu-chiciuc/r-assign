import { test, equal, notOk, ok, throws } from 'tap';
import {
  getNull,
  getNullable,
  isNull,
  isNullable,
  isNullish,
  isOptional,
  isString,
  nullable,
  nulled,
  nullish,
  parseNull,
  parseNullable,
} from '../lib';

const expectedNull = 'expected a null value';
const expectedNullable = 'expected an union of string | null';
const invalidValue = 'Invalid value type';
const received = 'but received undefined';

test('getNull', () => {
  equal(getNull(), null);
});

test('getNullable', () => {
  const getNullableString = getNullable(isString);

  equal(getNullableString(), null);
  equal(getNullableString(''), '');
  equal(getNullableString('data'), 'data');
  equal(getNullableString(null), null);

  throws(() => {
    // @ts-expect-error
    getNullable();
  }, TypeError('Invalid type guard provided'));
});

test('isNull', () => {
  equal(isNull, nulled);

  ok(isNull(null));
  notOk(isNull());
});

test('isNullable', () => {
  const isNullableString = isNullable(isString);

  equal(isNullable, nullable);

  ok(isNullableString(null));
  ok(isNullableString(''));
  notOk(isNullableString());

  throws(() => {
    // @ts-expect-error
    isNullable();
  }, TypeError('Invalid type guard provided'));

  throws(() => {
    // @ts-expect-error
    isNullable(isOptional(isString));
  }, TypeError('Optional type cannot be used in union declaration'));
});

test('isNullish', () => {
  const isNullishString = isNullish(isString);

  equal(isNullish, nullish);

  ok(isNullishString(null));
  ok(isNullishString());
  ok(isNullishString(''));
  notOk(isNullishString(true));

  throws(() => {
    // @ts-expect-error
    isNullish();
  }, TypeError('Invalid type guard provided'));

  throws(() => {
    // @ts-expect-error
    isNullish(isOptional(isString));
  }, TypeError('Optional type cannot be used in union declaration'));
});

test('parseNull', () => {
  equal(parseNull(null), null);

  throws(() => {
    parseNull();
  }, TypeError(`${invalidValue}, ${expectedNull} ${received}`));
});

test('parseNullable', () => {
  const parseNullableString = parseNullable(isString);

  equal(parseNullableString(null), null);
  equal(parseNullableString(''), '');

  throws(() => {
    parseNullableString();
  }, TypeError(`${invalidValue}, ${expectedNullable} ${received}`));
});
