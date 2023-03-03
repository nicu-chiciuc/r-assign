import { test, equal, notOk, ok, throws } from 'tap';
import { bigint, getBigInt, isBigInt, parseBigInt } from '../src/lib/bigint';

const expected = 'expected a BigInt value';
const invalidDefaultValue = 'Invalid default value type';
const invalidValue = 'Invalid value type';
const invalidValueWithProperty = `${invalidValue} for property "key"`;
const receivedNull = 'but received null';
const receivedNumber = 'but received a value of type number';

test('getBigInt', () => {
  const getBigIntNoDefault = getBigInt();

  equal(getBigIntNoDefault(), 0n);
  equal(getBigIntNoDefault(0n), 0n);
  equal(getBigIntNoDefault(1n), 1n);
  equal(getBigIntNoDefault(0), 0n);

  const getBigIntOne = getBigInt(1n);

  equal(getBigIntOne(), 1n);
  equal(getBigIntOne(0n), 0n);
  equal(getBigIntOne(1n), 1n);
  equal(getBigIntOne(0), 1n);

  throws(() => {
    // @ts-expect-error
    getBigInt(null);
  }, TypeError(`${invalidDefaultValue}, ${expected} ${receivedNull}`));

  throws(() => {
    // @ts-expect-error
    getBigInt(0);
  }, TypeError(`${invalidDefaultValue}, ${expected} ${receivedNumber}`));
});

test('isBigInt', () => {
  equal(isBigInt, bigint);

  notOk(isBigInt());
  notOk(isBigInt(0));
  ok(isBigInt(0n));
});

test('parseBigInt', () => {
  equal(parseBigInt(0n), 0n);

  throws(() => {
    parseBigInt(null);
  }, TypeError(`${invalidValue}, ${expected} ${receivedNull}`));

  throws(() => {
    parseBigInt(0);
  }, TypeError(`${invalidValue}, ${expected} ${receivedNumber}`));

  throws(() => {
    parseBigInt(null, 'key');
  }, TypeError(`${invalidValueWithProperty}, ${expected} ${receivedNull}`));

  throws(() => {
    parseBigInt(0, 'key');
  }, TypeError(`${invalidValueWithProperty}, ${expected} ${receivedNumber}`));
});
