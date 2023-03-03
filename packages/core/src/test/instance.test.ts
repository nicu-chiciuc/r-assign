import { test, equal, match, notOk, ok, throws } from 'tap';
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

  match(getDate(), new Date());
  match(getDate(new Date()), new Date());

  throws(() => {
    // @ts-expect-error
    getInstanceOf(Date);
  }, TypeError(`${invalidDefaultValue}, ${expected} ${received}`));
});

test('isInstanceOf', () => {
  const isDate = isInstanceOf(Date);

  equal(isInstanceOf, instance);

  ok(isDate(new Date()));
  notOk(isDate(null));

  throws(() => {
    // @ts-expect-error
    isInstanceOf();
  }, TypeError('Invalid constructor provided'));
});

test('parseInstanceOf', () => {
  const parseDate = parseInstanceOf(Date);

  match(parseDate(new Date()), new Date());

  throws(() => {
    parseDate();
  }, TypeError(`${invalidValue}, ${expected} ${received}`));
});
