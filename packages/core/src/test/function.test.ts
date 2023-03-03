import { func, isFunction, isOptional, isString, isTupleRestOf } from '../lib';

test('isFunction', () => {
  expect(isFunction).toEqual(func);

  expect(isFunction([])(() => null)).toBeTruthy();
  expect(isFunction([isString])(() => null)).toBeTruthy();
  expect(isFunction([isOptional(isString)])(() => null)).toBeTruthy();
  expect(isFunction([isTupleRestOf(isString)])(() => null)).toBeTruthy();
  expect(
    isFunction([isTupleRestOf(isString), isString])(() => null)
  ).toBeTruthy();
  expect(isFunction([], isString)(() => null)).toBeTruthy();
  expect(isFunction([])(null)).toBeFalsy();

  expect(() => {
    // @ts-expect-error - Test that it throws
    expect(isFunction([], isOptional(isString))(() => null)).toBeTruthy();
  }).toThrow(TypeError('Invalid use of optional type'));
});
