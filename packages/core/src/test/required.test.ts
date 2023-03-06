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
  ).toBe(true);
  expect(
    isRequired(isObjectOf({ a: isOptional(isString) }))({ a: undefined })
  ).toBe(false);
  expect(isRequired(isObjectOf({ a: isOptional(isString) }))({})).toBe(false);

  expect(
    isRequired(isObjectOf({ a: isOptional(isString) }, isRecordOf(isString)))({
      a: 'abc',
    })
  ).toBe(true);
  expect(
    isRequired(isObjectOf({ a: isOptional(isString) }, isRecordOf(isString)))({
      a: 'abc',
      b: 'def',
    })
  ).toBe(true);
  expect(
    isRequired(isObjectOf({ a: isOptional(isString) }, isRecordOf(isString)))({
      a: undefined,
    })
  ).toBe(false);
  expect(
    isRequired(isObjectOf({ a: isOptional(isString) }, isRecordOf(isString)))(
      {}
    )
  ).toBe(false);

  expect(
    isRequired(isObjectOf({ a: isOptionalUndefined(isString) }))({
      a: 'abc',
    })
  ).toBe(true);
  expect(
    isRequired(isObjectOf({ a: isOptionalUndefined(isString) }))({
      a: undefined,
    })
  ).toBe(false);
  expect(isRequired(isObjectOf({ a: isString }))({})).toBe(false);

  expect(isRequired(isObjectOf({ a: isString }))({ a: 'abc' })).toBe(true);
  expect(isRequired(isObjectOf({ a: isString }))({ a: undefined })).toBe(false);
  expect(isRequired(isObjectOf({ a: isString }))({})).toBe(false);

  expect(
    isRequired(isStrictObjectOf({ a: isOptional(isString) }))({ a: 'abc' })
  ).toBe(true);
  expect(
    isRequired(isStrictObjectOf({ a: isOptional(isString) }))({
      a: undefined,
    })
  ).toBe(false);
  expect(isRequired(isStrictObjectOf({ a: isOptional(isString) }))({})).toBe(
    false
  );

  expect(
    isRequired(isStrictObjectOf({ a: isOptionalUndefined(isString) }))({
      a: 'abc',
    })
  ).toBe(true);
  expect(
    isRequired(isStrictObjectOf({ a: isOptionalUndefined(isString) }))({
      a: undefined,
    })
  ).toBe(false);
  expect(isRequired(isStrictObjectOf({ a: isString }))({})).toBe(false);

  expect(isRequired(isStrictObjectOf({ a: isString }))({ a: 'abc' })).toBe(
    true
  );
  expect(isRequired(isStrictObjectOf({ a: isString }))({ a: undefined })).toBe(
    false
  );
  expect(isRequired(isStrictObjectOf({ a: isString }))({})).toBe(false);

  expect(isRequired(isTupleOf([isOptional(isString)]))(['abc'])).toBe(true);
  expect(isRequired(isTupleOf([isOptional(isString)]))([undefined])).toBe(
    false
  );
  expect(isRequired(isTupleOf([isOptional(isString)]))([])).toBe(false);

  expect(isRequired(isTupleOf([isOptionalUndefined(isString)]))(['abc'])).toBe(
    true
  );
  expect(
    isRequired(isTupleOf([isOptionalUndefined(isString)]))([undefined])
  ).toBe(false);
  expect(isRequired(isTupleOf([isOptionalUndefined(isString)]))([])).toBe(
    false
  );

  expect(isRequired(isTupleOf([isString]))(['abc'])).toBe(true);
  expect(isRequired(isTupleOf([isString]))([undefined])).toBe(false);
  expect(isRequired(isTupleOf([isString]))([])).toBe(false);

  expect(() => {
    // @ts-expect-error - Expect throw
    isRequired();
  }).toThrow(TypeError);

  expect(() => {
    // @ts-expect-error - Expect throw
    isRequired(isString);
  }).toThrow(TypeError);
});
