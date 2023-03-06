import { instance, isInstanceOf } from '../lib/instance';

const currentDate = new Date();

test('isInstanceOf', () => {
  const isDate = isInstanceOf(Date);

  expect(isInstanceOf).toEqual(instance);

  expect(isDate(currentDate)).toBeTruthy();
  expect(isDate(null)).toBeFalsy();

  expect(() => {
    // @ts-expect-error - Expect throw
    isInstanceOf();
  }).toThrow(TypeError('Invalid constructor provided'));
});
