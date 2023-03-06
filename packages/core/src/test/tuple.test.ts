import {
  isBoolean,
  isOptional,
  isOptionalUndefined,
  isString,
  isTupleOf,
  isTupleRestOf,
  tuple,
  tupleRest,
} from '../lib';

const invalidValue = 'Invalid value type';
const expected = 'expected a tuple of [ string ]';
const received = 'but received a tuple of [ number ]';
const receivedEmpty = 'but received an empty tuple []';

test('isTupleOf', () => {
  const isEmptyTuple = isTupleOf([]);

  expect(isTupleOf).toEqual(tuple);

  expect(isEmptyTuple([])).toBe(true);
  expect(isEmptyTuple([undefined])).toBe(false);

  const isTupleOfS = isTupleOf([isString]);

  expect(isTupleOfS(['abc'])).toBe(true);
  expect(isTupleOfS([])).toBe(false);

  const isTupleOfO = isTupleOf([isOptional(isString)]);

  expect(isTupleOfO(['abc'])).toBe(true);
  expect(isTupleOfO([])).toBe(true);
  expect(isTupleOfO([undefined])).toBe(false);

  const isTupleOfU = isTupleOf([isOptionalUndefined(isString)]);

  expect(isTupleOfU(['abc'])).toBe(true);
  expect(isTupleOfU([])).toBe(true);
  expect(isTupleOfU([undefined])).toBe(true);
  expect(isTupleOfU([null])).toBe(false);

  const isTupleOfSSS = isTupleOf([isString, isString, isString]);

  expect(isTupleOfSSS(['abc', 'def', 'ghi'])).toBe(true);
  expect(isTupleOfSSS([])).toBe(false);

  const isTupleOfSSO = isTupleOf([isString, isString, isOptional(isString)]);

  expect(isTupleOfSSO(['abc', 'def', 'ghi'])).toBe(true);
  expect(isTupleOfSSO(['abc', 'def'])).toBe(true);
  expect(isTupleOfSSO(['abc', 'def', undefined])).toBe(false);

  const isTupleOfSSU = isTupleOf([
    isString,
    isString,
    isOptionalUndefined(isString),
  ]);

  expect(isTupleOfSSU(['abc', 'def', 'ghi'])).toBe(true);
  expect(isTupleOfSSU(['abc', 'def'])).toBe(true);
  expect(isTupleOfSSU(['abc', 'def', undefined])).toBe(true);
  expect(isTupleOfSSU(['abc', 'def', null])).toBe(false);

  const isTupleOfSOO = isTupleOf([
    isString,
    isOptional(isString),
    isOptional(isString),
  ]);

  expect(isTupleOfSOO(['abc', 'def', 'ghi'])).toBe(true);
  expect(isTupleOfSOO(['abc', 'def'])).toBe(true);
  expect(isTupleOfSOO(['abc'])).toBe(true);
  expect(isTupleOfSSO(['abc', 'def', undefined])).toBe(false);
  expect(isTupleOfSOO(['abc', undefined, undefined])).toBe(false);

  const isTupleOfSOU = isTupleOf([
    isString,
    isOptional(isString),
    isOptionalUndefined(isString),
  ]);

  expect(isTupleOfSOU(['abc', 'def', 'ghi'])).toBe(true);
  expect(isTupleOfSOU(['abc', 'def'])).toBe(true);
  expect(isTupleOfSOU(['abc', 'def', undefined])).toBe(true);
  expect(isTupleOfSOU(['abc'])).toBe(true);
  expect(isTupleOfSOU(['abc', undefined])).toBe(false);

  const isTupleOfSUU = isTupleOf([
    isString,
    isOptionalUndefined(isString),
    isOptionalUndefined(isString),
  ]);

  expect(isTupleOfSUU(['abc', 'def', 'ghi'])).toBe(true);
  expect(isTupleOfSUU(['abc', 'def'])).toBe(true);
  expect(isTupleOfSUU(['abc', 'def', undefined])).toBe(true);
  expect(isTupleOfSUU(['abc', undefined, undefined])).toBe(true);
  expect(isTupleOfSUU(['abc', undefined])).toBe(true);
  expect(isTupleOfSUU(['abc'])).toBe(true);
  expect(isTupleOfSUU(['abc', null, null])).toBe(false);

  const isTupleOfOOO = isTupleOf([
    isOptional(isString),
    isOptional(isString),
    isOptional(isString),
  ]);

  expect(isTupleOfOOO(['abc', 'def', 'ghi'])).toBe(true);
  expect(isTupleOfOOO(['abc', 'def'])).toBe(true);
  expect(isTupleOfOOO(['abc'])).toBe(true);
  expect(isTupleOfOOO([])).toBe(true);

  const isTupleOfOOU = isTupleOf([
    isOptional(isString),
    isOptional(isString),
    isOptionalUndefined(isString),
  ]);

  expect(isTupleOfOOU(['abc', 'def', 'ghi'])).toBe(true);
  expect(isTupleOfOOU(['abc', 'def', undefined])).toBe(true);
  expect(isTupleOfOOU(['abc', 'def'])).toBe(true);
  expect(isTupleOfOOU(['abc'])).toBe(true);
  expect(isTupleOfOOU([])).toBe(true);
  expect(isTupleOfOOU(['abc', 'def', null])).toBe(false);

  const isTupleOfOUO = isTupleOf([
    isOptional(isString),
    isOptionalUndefined(isString),
    isOptional(isString),
  ]);

  expect(isTupleOfOUO(['abc', 'def', 'ghi'])).toBe(true);
  expect(isTupleOfOUO(['abc', undefined, 'def'])).toBe(true);
  expect(isTupleOfOUO(['abc', 'def'])).toBe(true);
  expect(isTupleOfOUO(['abc', undefined])).toBe(true);
  expect(isTupleOfOUO(['abc'])).toBe(true);
  expect(isTupleOfOUO([])).toBe(true);
  expect(isTupleOfOUO(['abc', null, 'def'])).toBe(false);
  expect(isTupleOfOUO(['abc', null])).toBe(false);

  const isTupleOfOUU = isTupleOf([
    isOptional(isString),
    isOptionalUndefined(isString),
    isOptionalUndefined(isString),
  ]);

  expect(isTupleOfOUU(['abc', 'def', 'ghi'])).toBe(true);
  expect(isTupleOfOUU(['abc', 'def', undefined])).toBe(true);
  expect(isTupleOfOUU(['abc', undefined, undefined])).toBe(true);
  expect(isTupleOfOUU(['abc', 'def'])).toBe(true);
  expect(isTupleOfOUU(['abc', undefined])).toBe(true);
  expect(isTupleOfOUU(['abc'])).toBe(true);
  expect(isTupleOfOUU([])).toBe(true);
  expect(isTupleOfOUU(['abc', 'def', null])).toBe(false);
  expect(isTupleOfOUU(['abc', null])).toBe(false);

  const isTupleOfUOO = isTupleOf([
    isOptionalUndefined(isString),
    isOptional(isString),
    isOptional(isString),
  ]);

  expect(isTupleOfUOO(['abc', 'def', 'ghi'])).toBe(true);
  expect(isTupleOfUOO([undefined, 'abc', 'def'])).toBe(true);
  expect(isTupleOfUOO(['abc', 'def'])).toBe(true);
  expect(isTupleOfUOO([undefined, 'abc'])).toBe(true);
  expect(isTupleOfUOO(['abc'])).toBe(true);
  expect(isTupleOfUOO([undefined])).toBe(true);
  expect(isTupleOfUOO([])).toBe(true);
  expect(isTupleOfUOO([null, 'abc', 'def'])).toBe(false);
  expect(isTupleOfUOO([null, 'abc'])).toBe(false);
  expect(isTupleOfUOO([null])).toBe(false);

  const isTupleOfUOU = isTupleOf([
    isOptionalUndefined(isString),
    isOptional(isString),
    isOptionalUndefined(isString),
  ]);

  expect(isTupleOfUOU(['abc', 'def', 'ghi'])).toBe(true);
  expect(isTupleOfUOU([undefined, 'abc', 'def'])).toBe(true);
  expect(isTupleOfUOU([undefined, 'abc', undefined])).toBe(true);
  expect(isTupleOfUOU(['abc', 'def'])).toBe(true);
  expect(isTupleOfUOU([undefined, 'abc'])).toBe(true);
  expect(isTupleOfUOU(['abc'])).toBe(true);
  expect(isTupleOfUOU([undefined])).toBe(true);
  expect(isTupleOfUOU([])).toBe(true);
  expect(isTupleOfUOU([null, 'abc', 'def'])).toBe(false);
  expect(isTupleOfUOU([null, 'abc', null])).toBe(false);
  expect(isTupleOfUOU([null, 'abc'])).toBe(false);
  expect(isTupleOfUOU([null])).toBe(false);

  const isTupleOfUUU = isTupleOf([
    isOptionalUndefined(isString),
    isOptionalUndefined(isString),
    isOptionalUndefined(isString),
  ]);

  expect(isTupleOfUUU(['abc', 'def', 'ghi'])).toBe(true);
  expect(isTupleOfUUU(['abc', 'def', undefined])).toBe(true);
  expect(isTupleOfUUU(['abc', undefined, 'def'])).toBe(true);
  expect(isTupleOfUUU(['abc', undefined, undefined])).toBe(true);
  expect(isTupleOfUUU([undefined, 'abc', 'def'])).toBe(true);
  expect(isTupleOfUUU([undefined, 'abc', undefined])).toBe(true);
  expect(isTupleOfUUU([undefined, undefined, undefined])).toBe(true);
  expect(isTupleOfUUU(['abc', 'def'])).toBe(true);
  expect(isTupleOfUUU(['abc', undefined])).toBe(true);
  expect(isTupleOfUUU([undefined, 'abc'])).toBe(true);
  expect(isTupleOfUUU([undefined, undefined])).toBe(true);
  expect(isTupleOfUUU(['abc'])).toBe(true);
  expect(isTupleOfUUU([undefined])).toBe(true);
  expect(isTupleOfUUU([])).toBe(true);
  expect(isTupleOfUUU(['abc', 'def', null])).toBe(false);
  expect(isTupleOfUUU(['abc', null, 'def'])).toBe(false);
  expect(isTupleOfUUU(['abc', null, null])).toBe(false);
  expect(isTupleOfUUU([null, 'abc', 'def'])).toBe(false);
  expect(isTupleOfUUU([null, 'abc', null])).toBe(false);
  expect(isTupleOfUUU([null, null, null])).toBe(false);
  expect(isTupleOfUUU(['abc', null])).toBe(false);
  expect(isTupleOfUUU([null, 'abc'])).toBe(false);
  expect(isTupleOfUUU([null, null])).toBe(false);
  expect(isTupleOfUUU([null])).toBe(false);

  expect(() => {
    // @ts-expect-error - Expect throw
    isTupleOf();
  }).toThrow(TypeError('Invalid type guards provided'));

  expect(() => {
    // @ts-expect-error - Expect throw
    isTupleOf([null]);
  }).toThrow(TypeError('Invalid type guard provided'));

  expect(() => {
    isTupleOf([isString, isOptional(isString), isString]);
  }).toThrow(TypeError('A required element cannot follow an optional element'));

  expect(() => {
    isTupleOf([isOptional(isString), isOptional(isString), isString]);
  }).toThrow(TypeError('A required element cannot follow an optional element'));

  expect(() => {
    isTupleOf([isOptional(isString), isString, isString]);
  }).toThrow(TypeError('A required element cannot follow an optional element'));

  expect(() => {
    isTupleOf([isString, isOptionalUndefined(isString), isString]);
  }).toThrow(TypeError('A required element cannot follow an optional element'));

  expect(() => {
    isTupleOf([
      isOptionalUndefined(isString),
      isOptionalUndefined(isString),
      isString,
    ]);
  }).toThrow(TypeError('A required element cannot follow an optional element'));

  expect(() => {
    isTupleOf([isOptionalUndefined(isString), isString, isString]);
  }).toThrow(TypeError('A required element cannot follow an optional element'));
});

test('isTupleRestOf', () => {
  expect(isTupleRestOf).toEqual(tupleRest);

  expect(isTupleOf([isTupleRestOf(isString)])([])).toBe(true);

  expect(isTupleOf([isBoolean, isTupleRestOf(isString)])([true])).toBe(true);
  expect(isTupleOf([isBoolean, isTupleRestOf(isString)])([true, 'abc'])).toBe(
    true
  );
  expect(
    isTupleOf([isBoolean, isTupleRestOf(isString)])([true, 'abc', 'def'])
  ).toBe(true);
  expect(isTupleOf([isBoolean, isTupleRestOf(isString)])([true, 0])).toBe(
    false
  );

  expect(isTupleOf([isTupleRestOf(isString), isBoolean])([true])).toBe(true);
  expect(isTupleOf([isTupleRestOf(isString), isBoolean])(['abc', true])).toBe(
    true
  );
  expect(
    isTupleOf([isTupleRestOf(isString), isBoolean])(['abc', 'def', true])
  ).toBe(true);
  expect(isTupleOf([isTupleRestOf(isString), isBoolean])([0, true])).toBe(
    false
  );

  expect(
    isTupleOf([isTupleRestOf(isString), isBoolean, isBoolean])([true, false])
  ).toBe(true);
  expect(
    isTupleOf([isTupleRestOf(isString), isBoolean, isBoolean])([
      'abc',
      true,
      false,
    ])
  ).toBe(true);
  expect(
    isTupleOf([isTupleRestOf(isString), isBoolean, isBoolean])([
      'abc',
      'def',
      true,
      false,
    ])
  ).toBe(true);
  expect(
    isTupleOf([isTupleRestOf(isString), isBoolean, isBoolean])([0, true, false])
  ).toBe(false);

  expect(isTupleOf([isOptional(isBoolean), isTupleRestOf(isString)])([])).toBe(
    true
  );
  expect(
    isTupleOf([isOptional(isBoolean), isTupleRestOf(isString)])([true])
  ).toBe(true);
  expect(
    isTupleOf([isOptional(isBoolean), isTupleRestOf(isString)])([true, 'abc'])
  ).toBe(true);
  expect(
    isTupleOf([isOptional(isBoolean), isTupleRestOf(isString)])([
      true,
      'abc',
      'def',
    ])
  ).toBe(true);

  expect(
    isTupleOf([isOptionalUndefined(isBoolean), isTupleRestOf(isString)])([])
  ).toBe(true);
  expect(
    isTupleOf([isOptionalUndefined(isBoolean), isTupleRestOf(isString)])([
      undefined,
    ])
  ).toBe(true);
  expect(
    isTupleOf([isOptionalUndefined(isBoolean), isTupleRestOf(isString)])([true])
  ).toBe(true);
  expect(
    isTupleOf([isOptionalUndefined(isBoolean), isTupleRestOf(isString)])([
      true,
      'abc',
    ])
  ).toBe(true);
  expect(
    isTupleOf([isOptionalUndefined(isBoolean), isTupleRestOf(isString)])([
      undefined,
      'abc',
    ])
  ).toBe(true);
  expect(
    isTupleOf([isOptionalUndefined(isBoolean), isTupleRestOf(isString)])([
      true,
      'abc',
      'def',
    ])
  ).toBe(true);
  expect(
    isTupleOf([isOptionalUndefined(isBoolean), isTupleRestOf(isString)])([
      undefined,
      'abc',
      'def',
    ])
  ).toBe(true);

  expect(() => {
    // @ts-expect-error - Expect throw
    isTupleRestOf(isTupleRestOf(isString));
  }).toThrow(TypeError('Invalid use of tuple rest'));

  expect(() => {
    isTupleOf([isTupleRestOf(isString), isOptional(isString)]);
  }).toThrow(TypeError('An optional element cannot follow a rest element'));

  expect(() => {
    isTupleOf([isTupleRestOf(isString), isOptionalUndefined(isString)]);
  }).toThrow(TypeError('An optional element cannot follow a rest element'));

  expect(() => {
    isTupleOf([isTupleRestOf(isString), isTupleRestOf(isString)]);
  }).toThrow(TypeError('A rest element cannot follow another rest element'));
});
