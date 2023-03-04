import {
  anyDate,
  asAnyDate,
  asDate,
  convertToAnyDate,
  convertToDate,
  date,
  isAnyDate,
  isDate,
} from '../lib';

test('asAnyDate', () => {
  expect(asAnyDate).toEqual(convertToAnyDate);

  expect(asAnyDate(new Date()) instanceof Date).toBeTruthy();
  expect(asAnyDate(new Date().getTime()) instanceof Date).toBeTruthy();
  expect(asAnyDate(new Date().toString()) instanceof Date).toBeTruthy();

  expect(() => {
    asAnyDate();
  }).toThrow(TypeError('Invalid date value'));
});

test('asDate', () => {
  expect(asDate).toEqual(convertToDate);

  expect(asDate(new Date()) instanceof Date).toBeTruthy();
  expect(asDate(new Date().getTime()) instanceof Date).toBeTruthy();
  expect(asDate(new Date().toString()) instanceof Date).toBeTruthy();

  expect(() => {
    asDate();
  }).toThrow(TypeError('Invalid date value'));

  expect(() => {
    asDate(NaN);
  }).toThrow(TypeError('Invalid date value'));
});

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
