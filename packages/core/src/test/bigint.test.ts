import { bigint, getBigInt, isBigInt, parseBigInt } from '../lib/bigint';

const expected = 'expected a BigInt value';
const invalidDefaultValue = 'Invalid default value type';
const invalidValue = 'Invalid value type';
const invalidValueWithProperty = `${invalidValue} for property "key"`;
const receivedNull = 'but received null';
const receivedNumber = 'but received a value of type number';

test('getBigInt', () => {
  const getBigIntNoDefault = getBigInt();

  expect(getBigIntNoDefault()).toEqual(0n);
  expect(getBigIntNoDefault(0n)).toEqual(0n);
  expect(getBigIntNoDefault(1n)).toEqual(1n);
  expect(getBigIntNoDefault(0)).toEqual(0n);

  const getBigIntOne = getBigInt(1n);

  expect(getBigIntOne()).toEqual(1n);
  expect(getBigIntOne(0n)).toEqual(0n);
  expect(getBigIntOne(1n)).toEqual(1n);
  expect(getBigIntOne(0)).toEqual(1n);

  expect(() => {
    // @ts-expect-error - Expect throw
    getBigInt(null);
  }).toThrow(TypeError(`${invalidDefaultValue}, ${expected} ${receivedNull}`));

  expect(() => {
    // @ts-expect-error - Expect throw
    getBigInt(0);
  }).toThrow(
    TypeError(`${invalidDefaultValue}, ${expected} ${receivedNumber}`)
  );
});

test('isBigInt', () => {
  expect(isBigInt).toEqual(bigint);

  expect(isBigInt()).toBeFalsy();
  expect(isBigInt(0)).toBeFalsy();
  expect(isBigInt(0n)).toBeTruthy();
});

test('parseBigInt', () => {
  expect(parseBigInt(0n)).toEqual(0n);

  expect(() => {
    parseBigInt(null);
  }).toThrow(TypeError(`${invalidValue}, ${expected} ${receivedNull}`));

  expect(() => {
    parseBigInt(0);
  }).toThrow(TypeError(`${invalidValue}, ${expected} ${receivedNumber}`));

  expect(() => {
    parseBigInt(null, 'key');
  }).toThrow(
    TypeError(`${invalidValueWithProperty}, ${expected} ${receivedNull}`)
  );

  expect(() => {
    parseBigInt(0, 'key');
  }).toThrow(
    TypeError(`${invalidValueWithProperty}, ${expected} ${receivedNumber}`)
  );
});
