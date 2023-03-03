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

const currentDate = new Date();

test('getInstanceOf', () => {
  const getDate = getInstanceOf(Date, currentDate);

  expect(getDate()).toEqual(currentDate);
  expect(getDate(currentDate)).toEqual(currentDate);

  expect(() => {
    // @ts-expect-error - Expect throw
    getInstanceOf(Date);
  }).toThrow(TypeError(`${invalidDefaultValue}, ${expected} ${received}`));
});

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

test('parseInstanceOf', () => {
  const parseDate = parseInstanceOf(Date);

  expect(parseDate(currentDate)).toEqual(currentDate);

  expect(() => {
    parseDate();
  }).toThrow(TypeError(`${invalidValue}, ${expected} ${received}`));
});
