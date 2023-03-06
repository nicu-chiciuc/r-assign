import { instance, isInstanceOf } from '../lib/instance';

const currentDate = new Date();

test('isInstanceOf', () => {
  const isDate = isInstanceOf(Date);

  expect(isInstanceOf).toEqual(instance);

  expect(isDate(currentDate)).toBe(true);
  expect(isDate(null)).toBe(false);

  expect(() => {
    // @ts-expect-error - Expect throw
    isInstanceOf();
  }).toThrow(TypeError('Invalid constructor provided'));
});
