import { func, isFunction, isOptional, isString, isTupleRestOf } from '../lib';

test('isFunction', () => {
  expect(isFunction).toEqual(func);

  expect(isFunction([])(() => null)).toBe(true);
  expect(isFunction([isString])(() => null)).toBe(true);
  expect(isFunction([isOptional(isString)])(() => null)).toBe(true);
  expect(isFunction([isTupleRestOf(isString)])(() => null)).toBe(true);
  expect(isFunction([isTupleRestOf(isString), isString])(() => null)).toBe(
    true
  );
  expect(isFunction([], isString)(() => null)).toBe(true);
  expect(isFunction([])(null)).toBe(false);

  expect(() => {
    // @ts-expect-error - Test that it throws
    expect(isFunction([], isOptional(isString))(() => null)).toBe(true);
  }).toThrow(TypeError('Invalid use of optional type'));
});
