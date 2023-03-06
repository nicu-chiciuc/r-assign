import { anyDate, date, isAnyDate, isDate } from '../lib';

test('isAnyDate', () => {
  expect(isAnyDate).toEqual(anyDate);

  expect(isAnyDate(new Date())).toBeTruthy();
  expect(isAnyDate(new Date(NaN))).toBeTruthy();

  expect(isAnyDate(0)).toBeFalsy();
});

test('isDate', () => {
  expect(isDate).toEqual(date);

  expect(isDate(new Date())).toBeTruthy();

  expect(isDate(new Date(NaN))).toBeFalsy();
  expect(isAnyDate(0)).toBeFalsy();
});
