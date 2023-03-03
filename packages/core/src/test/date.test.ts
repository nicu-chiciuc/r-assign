import { test, equal, notOk, ok, throws } from 'tap';
import {
  anyDate,
  asAnyDate,
  asDate,
  convertToAnyDate,
  convertToDate,
  date,
  isAnyDate,
  isDate,
} from '../src/lib';

test('asAnyDate', () => {
  equal(asAnyDate, convertToAnyDate);

  ok(asAnyDate(new Date()) instanceof Date);
  ok(asAnyDate(new Date().getTime()) instanceof Date);
  ok(asAnyDate(new Date().toString()) instanceof Date);

  throws(() => {
    asAnyDate();
  }, TypeError('Invalid date value'));
});

test('asDate', () => {
  equal(asDate, convertToDate);

  ok(asDate(new Date()) instanceof Date);
  ok(asDate(new Date().getTime()) instanceof Date);
  ok(asDate(new Date().toString()) instanceof Date);

  throws(() => {
    asDate();
  }, TypeError('Invalid date value'));

  throws(() => {
    asDate(NaN);
  }, TypeError('Invalid date value'));
});

test('isAnyDate', () => {
  equal(isAnyDate, anyDate);

  ok(isAnyDate(new Date()));
  ok(isAnyDate(new Date(NaN)));

  notOk(isAnyDate(0));
});

test('isDate', () => {
  equal(isDate, date);

  ok(isDate(new Date()));

  notOk(isDate(new Date(NaN)));
  notOk(isAnyDate(0));
});
