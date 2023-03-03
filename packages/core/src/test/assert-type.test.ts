import { assertType, isOptional, isString } from '../lib';

const invalidValue = 'Invalid value type';
const expected = 'expected a string value';
const received = 'but received a value of type number';

test('assertType', () => {
  assertType(isString, '');

  expect(() => {
    assertType(isString, 0);
  }).toThrow(TypeError(`${invalidValue}, ${expected} ${received}`));

  expect(() => {
    assertType(isString, 0, 'Custom error message');
  }).toThrow(TypeError('Custom error message'));

  expect(() => {
    // @ts-expect-error - Test that it throws
    assertType(isOptional(isString), '');
  }).toThrow(TypeError('Invalid use of optional type'));
});
