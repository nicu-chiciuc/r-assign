import {
  getTupleOf,
  isBoolean,
  isOptional,
  isOptionalUndefined,
  isString,
  isTupleOf,
  isTupleRestOf,
  parseTupleOf,
  tuple,
  tupleRest,
} from '../lib';

const invalidDefaultValue = 'Invalid default value type';
const invalidValue = 'Invalid value type';
const expected = 'expected a tuple of [ string ]';
const received = 'but received a tuple of [ number ]';
const receivedEmpty = 'but received an empty tuple []';

test('getTupleOf', () => {
  const getTupleOfString = getTupleOf([isString], ['abc']);

  expect(getTupleOfString(['abc'])).toEqual(['abc']);
  expect(getTupleOfString([])).toEqual(['abc']);

  expect(() => {
    // @ts-expect-error - Expect throw
    getTupleOf([isString]);
  }).toThrow(
    TypeError(`${invalidDefaultValue}, ${expected} but received undefined`)
  );
});

test('isTupleOf', () => {
  const isEmptyTuple = isTupleOf([]);

  expect(isTupleOf).toEqual(tuple);

  expect(isEmptyTuple([])).toBeTruthy();
  expect(isEmptyTuple([undefined])).toBeFalsy();

  const isTupleOfS = isTupleOf([isString]);

  expect(isTupleOfS(['abc'])).toBeTruthy();
  expect(isTupleOfS([])).toBeFalsy();

  const isTupleOfO = isTupleOf([isOptional(isString)]);

  expect(isTupleOfO(['abc'])).toBeTruthy();
  expect(isTupleOfO([])).toBeTruthy();
  expect(isTupleOfO([undefined])).toBeFalsy();

  const isTupleOfU = isTupleOf([isOptionalUndefined(isString)]);

  expect(isTupleOfU(['abc'])).toBeTruthy();
  expect(isTupleOfU([])).toBeTruthy();
  expect(isTupleOfU([undefined])).toBeTruthy();
  expect(isTupleOfU([null])).toBeFalsy();

  const isTupleOfSSS = isTupleOf([isString, isString, isString]);

  expect(isTupleOfSSS(['abc', 'def', 'ghi'])).toBeTruthy();
  expect(isTupleOfSSS([])).toBeFalsy();

  const isTupleOfSSO = isTupleOf([isString, isString, isOptional(isString)]);

  expect(isTupleOfSSO(['abc', 'def', 'ghi'])).toBeTruthy();
  expect(isTupleOfSSO(['abc', 'def'])).toBeTruthy();
  expect(isTupleOfSSO(['abc', 'def', undefined])).toBeFalsy();

  const isTupleOfSSU = isTupleOf([
    isString,
    isString,
    isOptionalUndefined(isString),
  ]);

  expect(isTupleOfSSU(['abc', 'def', 'ghi'])).toBeTruthy();
  expect(isTupleOfSSU(['abc', 'def'])).toBeTruthy();
  expect(isTupleOfSSU(['abc', 'def', undefined])).toBeTruthy();
  expect(isTupleOfSSU(['abc', 'def', null])).toBeFalsy();

  const isTupleOfSOO = isTupleOf([
    isString,
    isOptional(isString),
    isOptional(isString),
  ]);

  expect(isTupleOfSOO(['abc', 'def', 'ghi'])).toBeTruthy();
  expect(isTupleOfSOO(['abc', 'def'])).toBeTruthy();
  expect(isTupleOfSOO(['abc'])).toBeTruthy();
  expect(isTupleOfSSO(['abc', 'def', undefined])).toBeFalsy();
  expect(isTupleOfSOO(['abc', undefined, undefined])).toBeFalsy();

  const isTupleOfSOU = isTupleOf([
    isString,
    isOptional(isString),
    isOptionalUndefined(isString),
  ]);

  expect(isTupleOfSOU(['abc', 'def', 'ghi'])).toBeTruthy();
  expect(isTupleOfSOU(['abc', 'def'])).toBeTruthy();
  expect(isTupleOfSOU(['abc', 'def', undefined])).toBeTruthy();
  expect(isTupleOfSOU(['abc'])).toBeTruthy();
  expect(isTupleOfSOU(['abc', undefined])).toBeFalsy();

  const isTupleOfSUU = isTupleOf([
    isString,
    isOptionalUndefined(isString),
    isOptionalUndefined(isString),
  ]);

  expect(isTupleOfSUU(['abc', 'def', 'ghi'])).toBeTruthy();
  expect(isTupleOfSUU(['abc', 'def'])).toBeTruthy();
  expect(isTupleOfSUU(['abc', 'def', undefined])).toBeTruthy();
  expect(isTupleOfSUU(['abc', undefined, undefined])).toBeTruthy();
  expect(isTupleOfSUU(['abc', undefined])).toBeTruthy();
  expect(isTupleOfSUU(['abc'])).toBeTruthy();
  expect(isTupleOfSUU(['abc', null, null])).toBeFalsy();

  const isTupleOfOOO = isTupleOf([
    isOptional(isString),
    isOptional(isString),
    isOptional(isString),
  ]);

  expect(isTupleOfOOO(['abc', 'def', 'ghi'])).toBeTruthy();
  expect(isTupleOfOOO(['abc', 'def'])).toBeTruthy();
  expect(isTupleOfOOO(['abc'])).toBeTruthy();
  expect(isTupleOfOOO([])).toBeTruthy();

  const isTupleOfOOU = isTupleOf([
    isOptional(isString),
    isOptional(isString),
    isOptionalUndefined(isString),
  ]);

  expect(isTupleOfOOU(['abc', 'def', 'ghi'])).toBeTruthy();
  expect(isTupleOfOOU(['abc', 'def', undefined])).toBeTruthy();
  expect(isTupleOfOOU(['abc', 'def'])).toBeTruthy();
  expect(isTupleOfOOU(['abc'])).toBeTruthy();
  expect(isTupleOfOOU([])).toBeTruthy();
  expect(isTupleOfOOU(['abc', 'def', null])).toBeFalsy();

  const isTupleOfOUO = isTupleOf([
    isOptional(isString),
    isOptionalUndefined(isString),
    isOptional(isString),
  ]);

  expect(isTupleOfOUO(['abc', 'def', 'ghi'])).toBeTruthy();
  expect(isTupleOfOUO(['abc', undefined, 'def'])).toBeTruthy();
  expect(isTupleOfOUO(['abc', 'def'])).toBeTruthy();
  expect(isTupleOfOUO(['abc', undefined])).toBeTruthy();
  expect(isTupleOfOUO(['abc'])).toBeTruthy();
  expect(isTupleOfOUO([])).toBeTruthy();
  expect(isTupleOfOUO(['abc', null, 'def'])).toBeFalsy();
  expect(isTupleOfOUO(['abc', null])).toBeFalsy();

  const isTupleOfOUU = isTupleOf([
    isOptional(isString),
    isOptionalUndefined(isString),
    isOptionalUndefined(isString),
  ]);

  expect(isTupleOfOUU(['abc', 'def', 'ghi'])).toBeTruthy();
  expect(isTupleOfOUU(['abc', 'def', undefined])).toBeTruthy();
  expect(isTupleOfOUU(['abc', undefined, undefined])).toBeTruthy();
  expect(isTupleOfOUU(['abc', 'def'])).toBeTruthy();
  expect(isTupleOfOUU(['abc', undefined])).toBeTruthy();
  expect(isTupleOfOUU(['abc'])).toBeTruthy();
  expect(isTupleOfOUU([])).toBeTruthy();
  expect(isTupleOfOUU(['abc', 'def', null])).toBeFalsy();
  expect(isTupleOfOUU(['abc', null])).toBeFalsy();

  const isTupleOfUOO = isTupleOf([
    isOptionalUndefined(isString),
    isOptional(isString),
    isOptional(isString),
  ]);

  expect(isTupleOfUOO(['abc', 'def', 'ghi'])).toBeTruthy();
  expect(isTupleOfUOO([undefined, 'abc', 'def'])).toBeTruthy();
  expect(isTupleOfUOO(['abc', 'def'])).toBeTruthy();
  expect(isTupleOfUOO([undefined, 'abc'])).toBeTruthy();
  expect(isTupleOfUOO(['abc'])).toBeTruthy();
  expect(isTupleOfUOO([undefined])).toBeTruthy();
  expect(isTupleOfUOO([])).toBeTruthy();
  expect(isTupleOfUOO([null, 'abc', 'def'])).toBeFalsy();
  expect(isTupleOfUOO([null, 'abc'])).toBeFalsy();
  expect(isTupleOfUOO([null])).toBeFalsy();

  const isTupleOfUOU = isTupleOf([
    isOptionalUndefined(isString),
    isOptional(isString),
    isOptionalUndefined(isString),
  ]);

  expect(isTupleOfUOU(['abc', 'def', 'ghi'])).toBeTruthy();
  expect(isTupleOfUOU([undefined, 'abc', 'def'])).toBeTruthy();
  expect(isTupleOfUOU([undefined, 'abc', undefined])).toBeTruthy();
  expect(isTupleOfUOU(['abc', 'def'])).toBeTruthy();
  expect(isTupleOfUOU([undefined, 'abc'])).toBeTruthy();
  expect(isTupleOfUOU(['abc'])).toBeTruthy();
  expect(isTupleOfUOU([undefined])).toBeTruthy();
  expect(isTupleOfUOU([])).toBeTruthy();
  expect(isTupleOfUOU([null, 'abc', 'def'])).toBeFalsy();
  expect(isTupleOfUOU([null, 'abc', null])).toBeFalsy();
  expect(isTupleOfUOU([null, 'abc'])).toBeFalsy();
  expect(isTupleOfUOU([null])).toBeFalsy();

  const isTupleOfUUU = isTupleOf([
    isOptionalUndefined(isString),
    isOptionalUndefined(isString),
    isOptionalUndefined(isString),
  ]);

  expect(isTupleOfUUU(['abc', 'def', 'ghi'])).toBeTruthy();
  expect(isTupleOfUUU(['abc', 'def', undefined])).toBeTruthy();
  expect(isTupleOfUUU(['abc', undefined, 'def'])).toBeTruthy();
  expect(isTupleOfUUU(['abc', undefined, undefined])).toBeTruthy();
  expect(isTupleOfUUU([undefined, 'abc', 'def'])).toBeTruthy();
  expect(isTupleOfUUU([undefined, 'abc', undefined])).toBeTruthy();
  expect(isTupleOfUUU([undefined, undefined, undefined])).toBeTruthy();
  expect(isTupleOfUUU(['abc', 'def'])).toBeTruthy();
  expect(isTupleOfUUU(['abc', undefined])).toBeTruthy();
  expect(isTupleOfUUU([undefined, 'abc'])).toBeTruthy();
  expect(isTupleOfUUU([undefined, undefined])).toBeTruthy();
  expect(isTupleOfUUU(['abc'])).toBeTruthy();
  expect(isTupleOfUUU([undefined])).toBeTruthy();
  expect(isTupleOfUUU([])).toBeTruthy();
  expect(isTupleOfUUU(['abc', 'def', null])).toBeFalsy();
  expect(isTupleOfUUU(['abc', null, 'def'])).toBeFalsy();
  expect(isTupleOfUUU(['abc', null, null])).toBeFalsy();
  expect(isTupleOfUUU([null, 'abc', 'def'])).toBeFalsy();
  expect(isTupleOfUUU([null, 'abc', null])).toBeFalsy();
  expect(isTupleOfUUU([null, null, null])).toBeFalsy();
  expect(isTupleOfUUU(['abc', null])).toBeFalsy();
  expect(isTupleOfUUU([null, 'abc'])).toBeFalsy();
  expect(isTupleOfUUU([null, null])).toBeFalsy();
  expect(isTupleOfUUU([null])).toBeFalsy();

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

  expect(isTupleOf([isTupleRestOf(isString)])([])).toBeTruthy();

  expect(isTupleOf([isBoolean, isTupleRestOf(isString)])([true])).toBeTruthy();
  expect(
    isTupleOf([isBoolean, isTupleRestOf(isString)])([true, 'abc'])
  ).toBeTruthy();
  expect(
    isTupleOf([isBoolean, isTupleRestOf(isString)])([true, 'abc', 'def'])
  ).toBeTruthy();
  expect(
    isTupleOf([isBoolean, isTupleRestOf(isString)])([true, 0])
  ).toBeFalsy();

  expect(isTupleOf([isTupleRestOf(isString), isBoolean])([true])).toBeTruthy();
  expect(
    isTupleOf([isTupleRestOf(isString), isBoolean])(['abc', true])
  ).toBeTruthy();
  expect(
    isTupleOf([isTupleRestOf(isString), isBoolean])(['abc', 'def', true])
  ).toBeTruthy();
  expect(
    isTupleOf([isTupleRestOf(isString), isBoolean])([0, true])
  ).toBeFalsy();

  expect(
    isTupleOf([isTupleRestOf(isString), isBoolean, isBoolean])([true, false])
  ).toBeTruthy();
  expect(
    isTupleOf([isTupleRestOf(isString), isBoolean, isBoolean])([
      'abc',
      true,
      false,
    ])
  ).toBeTruthy();
  expect(
    isTupleOf([isTupleRestOf(isString), isBoolean, isBoolean])([
      'abc',
      'def',
      true,
      false,
    ])
  ).toBeTruthy();
  expect(
    isTupleOf([isTupleRestOf(isString), isBoolean, isBoolean])([0, true, false])
  ).toBeFalsy();

  expect(
    isTupleOf([isOptional(isBoolean), isTupleRestOf(isString)])([])
  ).toBeTruthy();
  expect(
    isTupleOf([isOptional(isBoolean), isTupleRestOf(isString)])([true])
  ).toBeTruthy();
  expect(
    isTupleOf([isOptional(isBoolean), isTupleRestOf(isString)])([true, 'abc'])
  ).toBeTruthy();
  expect(
    isTupleOf([isOptional(isBoolean), isTupleRestOf(isString)])([
      true,
      'abc',
      'def',
    ])
  ).toBeTruthy();

  expect(
    isTupleOf([isOptionalUndefined(isBoolean), isTupleRestOf(isString)])([])
  ).toBeTruthy();
  expect(
    isTupleOf([isOptionalUndefined(isBoolean), isTupleRestOf(isString)])([
      undefined,
    ])
  ).toBeTruthy();
  expect(
    isTupleOf([isOptionalUndefined(isBoolean), isTupleRestOf(isString)])([true])
  ).toBeTruthy();
  expect(
    isTupleOf([isOptionalUndefined(isBoolean), isTupleRestOf(isString)])([
      true,
      'abc',
    ])
  ).toBeTruthy();
  expect(
    isTupleOf([isOptionalUndefined(isBoolean), isTupleRestOf(isString)])([
      undefined,
      'abc',
    ])
  ).toBeTruthy();
  expect(
    isTupleOf([isOptionalUndefined(isBoolean), isTupleRestOf(isString)])([
      true,
      'abc',
      'def',
    ])
  ).toBeTruthy();
  expect(
    isTupleOf([isOptionalUndefined(isBoolean), isTupleRestOf(isString)])([
      undefined,
      'abc',
      'def',
    ])
  ).toBeTruthy();

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

test('parseTupleOf', () => {
  const parseTupleOfString = parseTupleOf([isString]);

  expect(parseTupleOfString(['abc'])).toEqual(['abc']);

  expect(() => {
    parseTupleOfString([]);
  }).toThrow(TypeError(`${invalidValue}, ${expected} ${receivedEmpty}`));

  expect(() => {
    parseTupleOfString([0]);
  }).toThrow(TypeError(`${invalidValue}, ${expected} ${received}`));
});
