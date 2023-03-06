import { array, isArrayOf } from '../lib/array';
import { isBoolean } from '../lib/boolean';
import { isOptional } from '../lib/optional';
import { isString } from '../lib/string';

const invalidOptionalType = 'Invalid use of optional type';
const invalidTypeGuard = 'Invalid type guard provided';

test('isArrayOf', () => {
  const sparseArrayLength = 3;
  const sparseArray = new Array(sparseArrayLength);

  sparseArray[1] = true;

  expect(isArrayOf).toBe(array);

  expect(isArrayOf(isBoolean)([])).toBeTruthy();
  expect(isArrayOf(isBoolean)([true])).toBeTruthy();
  expect(isArrayOf(isBoolean)(sparseArray)).toBeFalsy();
  // @ts-expect-error - Expects 1 argument
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
