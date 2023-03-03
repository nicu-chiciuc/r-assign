import { test, equal, notOk, ok, throws } from 'tap';
import { func, isFunction, isOptional, isString, isTupleRestOf } from '../lib';

test('isFunction', () => {
  equal(isFunction, func);

  ok(isFunction([])(() => null));
  ok(isFunction([isString])(() => null));
  ok(isFunction([isOptional(isString)])(() => null));
  ok(isFunction([isTupleRestOf(isString)])(() => null));
  ok(isFunction([isTupleRestOf(isString), isString])(() => null));
  ok(isFunction([], isString)(() => null));
  notOk(isFunction([])(null));

  throws(() => {
    // @ts-expect-error
    ok(isFunction([], isOptional(isString))(() => null));
  }, TypeError('Invalid use of optional type'));
});
