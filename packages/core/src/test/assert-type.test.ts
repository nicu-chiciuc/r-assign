import { test, throws } from 'tap';
import { assertType, isOptional, isString } from '../src/lib';

const invalidValue = 'Invalid value type';
const expected = 'expected a string value';
const received = 'but received a value of type number';

test('assertType', () => {
  assertType(isString, '');

  throws(() => {
    assertType(isString, 0);
  }, TypeError(`${invalidValue}, ${expected} ${received}`));

  throws(() => {
    assertType(isString, 0, 'Custom error message');
  }, TypeError('Custom error message'));

  throws(() => {
    // @ts-expect-error
    assertType(isOptional(isString), '');
  }, TypeError('Invalid use of optional type'));
});
