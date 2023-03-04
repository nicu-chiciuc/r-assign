import { array, getArrayOf, isArrayOf, parseArrayOf } from '../lib/array';
import { isBoolean } from '../lib/boolean';
import { isOptional } from '../lib/optional';
import { isString } from '../lib/string';
import { isUnionOf } from '../lib/union';

const expectedSingle = 'expected an array of strings';
const expectedUnion = 'expected an array of boolean | string';
const invalidDefaultValue = 'Invalid default value type';
const invalidOptionalType = 'Invalid use of optional type';
const invalidTypeGuard = 'Invalid type guard provided';
const invalidValue = 'Invalid value type';
const invalidValueWithProperty = `${invalidValue} for property "key"`;
const received = 'but received null';
const receivedFunction = 'but received a value of type Function';
const receivedMixedArray = 'but received a value of type (string | number)[]';
const receivedNullArray = 'but received a value of type null[]';
const receivedObjectArray = 'but received a value of type Object[]';
const receivedStringArray = 'but received a value of type String[]';

// TODO: fix this
// test('getArrayOf', () => {
//   const getArrayOfString = getArrayOf(isString);

//   expect(getArrayOfString()).toEqual([]);
//   expect(getArrayOfString(null)).toEqual([]);
//   expect(getArrayOfString([])).toEqual([]);
//   expect(getArrayOfString([''])).toEqual(['']);

//   expect(() => {
//     // @ts-expect-error - Test that it throws
//     getArrayOf();
//   }).toThrow(TypeError(invalidTypeGuard));

//   expect(() => {
//     // @ts-expect-error - Test that it throws
//     getArrayOf(isString, null);
//   }).toThrow(
//     TypeError(`${invalidDefaultValue}, ${expectedSingle} ${received}`)
//   );

//   expect(() => {
//     // @ts-expect-error - Test that it throws
//     getArrayOf(isUnionOf([isBoolean, isString]), null);
//   }).toThrow(TypeError(`${invalidDefaultValue}, ${expectedUnion} ${received}`));
// });

test('isArrayOf', () => {
  const sparseArrayLength = 3;
  const sparseArray = new Array(sparseArrayLength);

  sparseArray[1] = true;

  expect(isArrayOf).toBe(array);

  expect(isArrayOf(isBoolean)([])).toBeTruthy();
  expect(isArrayOf(isBoolean)([true])).toBeTruthy();
  expect(isArrayOf(isBoolean)(sparseArray)).toBeFalsy();
  expect(isArrayOf(isBoolean)()).toBeFalsy();

  expect(() => {
    // @ts-expect-error - Test that it throws
    isArrayOf();
  }).toThrow(TypeError(invalidTypeGuard));

  expect(() => {
    // @ts-expect-error - Test that it throws
    isArrayOf(isOptional(isString));
  }).toThrow(TypeError(invalidOptionalType));
});

test('parseArrayOf', () => {
  const parseArrayOfStrings = parseArrayOf(isString);

  expect(parseArrayOfStrings([''])).toEqual(['']);

  expect(() => {
    // @ts-expect-error - Test that it throws
    parseArrayOf(null);
  }).toThrow(TypeError(invalidTypeGuard));

  expect(() => {
    parseArrayOfStrings(null);
  }).toThrow(TypeError(`${invalidValue}, ${expectedSingle} ${received}`));

  expect(() => {
    parseArrayOfStrings(() => null);
  }).toThrow(
    TypeError(`${invalidValue}, ${expectedSingle} ${receivedFunction}`)
  );

  expect(() => {
    parseArrayOfStrings([null]);
  }).toThrow(
    TypeError(`${invalidValue}, ${expectedSingle} ${receivedNullArray}`)
  );

  expect(() => {
    // eslint-disable-next-line no-new-wrappers
    parseArrayOfStrings([new String()]);
  }).toThrow(
    TypeError(`${invalidValue}, ${expectedSingle} ${receivedStringArray}`)
  );

  expect(() => {
    parseArrayOfStrings([Object.create(null)]);
  }).toThrow(
    TypeError(`${invalidValue}, ${expectedSingle} ${receivedObjectArray}`)
  );

  expect(() => {
    parseArrayOfStrings(['', 0]);
  }).toThrow(
    TypeError(`${invalidValue}, ${expectedSingle} ${receivedMixedArray}`)
  );

  expect(() => {
    parseArrayOfStrings(null, 'key');
  }).toThrow(
    TypeError(`${invalidValueWithProperty}, ${expectedSingle} ${received}`)
  );
});
