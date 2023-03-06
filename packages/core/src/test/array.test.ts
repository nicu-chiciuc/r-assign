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

  expect(array(isBoolean)([])).toBe(true);
  expect(array(isBoolean)([true])).toBe(true);
  expect(array(isBoolean)(sparseArray)).toBe(false);
  // @ts-expect-error - Expects 1 argument
  expect(array(isBoolean)()).toBe(false);

  expect(() => {
    // @ts-expect-error - Test that it throws
    array();
  }).toThrow(TypeError(invalidTypeGuard));

  expect(() => {
    // @ts-expect-error - Test that it throws
    array(isOptional(isString));
  }).toThrow(TypeError(invalidOptionalType));
});
