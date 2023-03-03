import { test, equal, notOk, ok, throws } from 'tap';
import {
  isOptional,
  isOptionalUndefined,
  isString,
  optional,
  optionalUndef,
} from '../lib';

test('isOptional', () => {
  const isOptionalString = isOptional(isString);

  equal(isOptional, optional);

  ok(isOptionalString(''));
  notOk(isOptionalString());
  notOk(isOptionalString(null));

  throws(() => {
    // @ts-expect-error
    isOptional();
  }, TypeError('Invalid type guard provided'));

  throws(() => {
    // @ts-expect-error
    isOptional(isOptional(isString));
  }, TypeError('Optional type cannot be wrapped in optional type'));
});

test('isOptionalUndefined', () => {
  const isOptionalString = isOptionalUndefined(isString);

  equal(isOptionalUndefined, optionalUndef);

  ok(isOptionalString());
  ok(isOptionalString(''));
  notOk(isOptionalString(null));

  throws(() => {
    // @ts-expect-error
    isOptionalUndefined();
  }, TypeError('Invalid type guard provided'));

  throws(() => {
    // @ts-expect-error
    isOptionalUndefined(isOptionalUndefined(isString));
  }, TypeError('Optional type cannot be wrapped in optional type'));
});
