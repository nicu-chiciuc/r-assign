import { anyDate, date, isAnyDate, isDate } from '../lib';

test('isAnyDate', () => {
  expect(isAnyDate).toEqual(anyDate);

  expect(isAnyDate(new Date())).toBe(true);
  expect(isAnyDate(new Date(NaN))).toBe(true);

  expect(isAnyDate(0)).toBe(false);
});

test('isDate', () => {
  expect(isDate).toEqual(date);

  expect(isDate(new Date())).toBe(true);

  expect(isDate(new Date(NaN))).toBe(false);
  expect(isAnyDate(0)).toBe(false);
});
