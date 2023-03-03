import {
  isObjectOf,
  isOptional,
  isOptionalUndefined,
  isRecordOf,
  isRequired,
  isStrictObjectOf,
  isString,
  isTupleOf,
  required,
} from '../lib';

test('isRequired', () => {
  expect(isRequired).toEqual(required);

  expect(
    isRequired(isObjectOf({ a: isOptional(isString) }))({ a: 'abc' })
  ).toBeTruthy();
  expect(
    isRequired(isObjectOf({ a: isOptional(isString) }))({ a: undefined })
  ).toBeFalsy();
  expect(isRequired(isObjectOf({ a: isOptional(isString) }))({})).toBeFalsy();

  expect(
    isRequired(isObjectOf({ a: isOptional(isString) }, isRecordOf(isString)))({
      a: 'abc',
    })
  ).toBeTruthy();
  expect(
    isRequired(isObjectOf({ a: isOptional(isString) }, isRecordOf(isString)))({
      a: 'abc',
      b: 'def',
    })
  ).toBeTruthy();
  expect(
    isRequired(isObjectOf({ a: isOptional(isString) }, isRecordOf(isString)))({
      a: undefined,
    })
  ).toBeFalsy();
  expect(
    isRequired(isObjectOf({ a: isOptional(isString) }, isRecordOf(isString)))(
      {}
    )
  ).toBeFalsy();

  expect(
    isRequired(isObjectOf({ a: isOptionalUndefined(isString) }))({
      a: 'abc',
    })
  ).toBeTruthy();
  expect(
    isRequired(isObjectOf({ a: isOptionalUndefined(isString) }))({
      a: undefined,
    })
  ).toBeFalsy();
  expect(isRequired(isObjectOf({ a: isString }))({})).toBeFalsy();

  expect(isRequired(isObjectOf({ a: isString }))({ a: 'abc' })).toBeTruthy();
  expect(isRequired(isObjectOf({ a: isString }))({ a: undefined })).toBeFalsy();
  expect(isRequired(isObjectOf({ a: isString }))({})).toBeFalsy();

  expect(
    isRequired(isStrictObjectOf({ a: isOptional(isString) }))({ a: 'abc' })
  ).toBeTruthy();
  expect(
    isRequired(isStrictObjectOf({ a: isOptional(isString) }))({
      a: undefined,
    })
  ).toBeFalsy();
  expect(
    isRequired(isStrictObjectOf({ a: isOptional(isString) }))({})
  ).toBeFalsy();

  expect(
    isRequired(isStrictObjectOf({ a: isOptionalUndefined(isString) }))({
      a: 'abc',
    })
  ).toBeTruthy();
  expect(
    isRequired(isStrictObjectOf({ a: isOptionalUndefined(isString) }))({
      a: undefined,
    })
  ).toBeFalsy();
  expect(isRequired(isStrictObjectOf({ a: isString }))({})).toBeFalsy();

  expect(
    isRequired(isStrictObjectOf({ a: isString }))({ a: 'abc' })
  ).toBeTruthy();
  expect(
    isRequired(isStrictObjectOf({ a: isString }))({ a: undefined })
  ).toBeFalsy();
  expect(isRequired(isStrictObjectOf({ a: isString }))({})).toBeFalsy();

  expect(isRequired(isTupleOf([isOptional(isString)]))(['abc'])).toBeTruthy();
  expect(
    isRequired(isTupleOf([isOptional(isString)]))([undefined])
  ).toBeFalsy();
  expect(isRequired(isTupleOf([isOptional(isString)]))([])).toBeFalsy();

  expect(
    isRequired(isTupleOf([isOptionalUndefined(isString)]))(['abc'])
  ).toBeTruthy();
  expect(
    isRequired(isTupleOf([isOptionalUndefined(isString)]))([undefined])
  ).toBeFalsy();
  expect(
    isRequired(isTupleOf([isOptionalUndefined(isString)]))([])
  ).toBeFalsy();

  expect(isRequired(isTupleOf([isString]))(['abc'])).toBeTruthy();
  expect(isRequired(isTupleOf([isString]))([undefined])).toBeFalsy();
  expect(isRequired(isTupleOf([isString]))([])).toBeFalsy();

  expect(() => {
    // @ts-expect-error - Expect throw
    isRequired();
  }).toThrow(TypeError);

  expect(() => {
    // @ts-expect-error - Expect throw
    isRequired(isString);
  }).toThrow(TypeError);
});
