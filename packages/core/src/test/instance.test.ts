import {
  getInstanceOf,
  instance,
  isInstanceOf,
  parseInstanceOf,
} from '../lib/instance';

const expected = 'expected an instance of Date';
const invalidDefaultValue = 'Invalid default value type';
const invalidValue = 'Invalid value type';
const received = 'but received undefined';

test('getInstanceOf', () => {
  const getDate = getInstanceOf(Date, new Date());

  expect(getDate()).toEqual(new Date());
  expect(getDate(new Date())).toEqual(new Date());

  expect(() => {
    // @ts-expect-error - Expect throw
    getInstanceOf(Date);
  }).toThrow(TypeError(`${invalidDefaultValue}, ${expected} ${received}`));
});

test('isInstanceOf', () => {
  const isDate = isInstanceOf(Date);

  expect(isInstanceOf).toEqual(instance);

  expect(isDate(new Date())).toBeTruthy();
  expect(isDate(null)).toBeFalsy();

  expect(() => {
    // @ts-expect-error - Expect throw
    isInstanceOf();
  }).toThrow(TypeError('Invalid constructor provided'));
});

test('parseInstanceOf', () => {
  const parseDate = parseInstanceOf(Date);

  expect(parseDate(new Date())).toEqual(new Date());

  expect(() => {
    parseDate();
  }).toThrow(TypeError(`${invalidValue}, ${expected} ${received}`));
});
