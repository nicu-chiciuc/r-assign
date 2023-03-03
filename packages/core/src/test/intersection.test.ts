import {
  getIntersectionOf,
  isAny,
  isBoolean,
  isIntersectionOf,
  isNumber,
  isObjectOf,
  isOptional,
  isString,
  parseIntersectionOf,
  TG,
} from '../lib';

/**
 * @template [T = any]
 * @typedef {import('../lib').TG<T>} TG
 */

const numberObject = '{\n "number": number;\n}';
const stringObject = '{\n "string": string;\n}';
const intersectionAnnotation = `(${numberObject} & ${stringObject})`;
const expected = `expected an intersection of ${intersectionAnnotation}`;
const invalidDefaultValue = 'Invalid default value type';
const invalidValue = 'Invalid value type';
const received = 'but received null';

test('getIntersectionOf', () => {
  const intersection: [TG<{ number: number }>, TG<{ string: string }>] = [
    isObjectOf({
      number: isNumber,
    }),
    isObjectOf({
      string: isString,
    }),
  ];

  const getIntersectionOfNumberString = getIntersectionOf(intersection, {
    number: 0,
    string: '',
  });

  expect(getIntersectionOfNumberString()).toEqual({ number: 0, string: '' });
  expect(getIntersectionOfNumberString(null)).toEqual({
    number: 0,
    string: '',
  });
  expect(
    getIntersectionOfNumberString({
      number: 1,
    })
  ).toEqual({ number: 0, string: '' });
  expect(
    getIntersectionOfNumberString({
      number: 1,
      string: 'data',
    })
  ).toEqual({ number: 1, string: 'data' });

  expect(() => {
    getIntersectionOf(
      [
        isObjectOf({
          number: isNumber,
        }),
        isObjectOf({
          string: isString,
        }),
      ],
      // @ts-expect-error - Expect throw
      null
    );
  }).toThrow(TypeError(`${invalidDefaultValue}, ${expected} ${received}`));
});

test('isIntersectionOf', () => {
  expect(isIntersectionOf([isBoolean, isNumber, isAny])('')).toBeTruthy();

  expect(
    isIntersectionOf([
      isObjectOf({
        number: isNumber,
      }),
      isObjectOf({
        string: isString,
      }),
    ])({ number: 0, string: '' })
  ).toBeTruthy();

  expect(
    isIntersectionOf([
      isObjectOf({
        boolean: isBoolean,
      }),
      isObjectOf({
        number: isNumber,
      }),
      isObjectOf({
        string: isString,
      }),
    ])({ boolean: false, number: 0, string: '' })
  ).toBeTruthy();

  expect(
    isIntersectionOf([
      isObjectOf({
        boolean: isBoolean,
      }),
      isObjectOf({
        number: isNumber,
      }),
      isObjectOf({
        string: isString,
      }),
    ])({ boolean: false, number: 0 })
  ).toBeFalsy();

  expect(() => {
    // @ts-expect-error - Expect throw
    isIntersectionOf();
  }).toThrow(TypeError('Invalid type guards provided'));

  expect(() => {
    // @ts-expect-error - Expect throw
    isIntersectionOf([]);
  }).toThrow(TypeError('Not enough type guards, at least two expected'));

  expect(() => {
    // @ts-expect-error - Expect throw
    isIntersectionOf([null, null]);
  }).toThrow(TypeError('Invalid type guard provided'));

  expect(() => {
    isIntersectionOf([isNumber, isString]);
  }).toThrow(TypeError('Provided intersection is impossible'));

  expect(() => {
    isIntersectionOf([isOptional(isNumber), isString]);
  }).toThrow(
    TypeError('Optional type cannot be used in intersection declaration')
  );
});

test('parseIntersectionOf', () => {
  const parseIntersectionOfNumberString = parseIntersectionOf([
    isObjectOf({
      number: isNumber,
    }),
    isObjectOf({
      string: isString,
    }),
  ]);

  expect(
    parseIntersectionOfNumberString({
      number: 1,
      string: 'data',
    })
  ).toEqual({
    number: 1,
    string: 'data',
  });

  expect(() => {
    parseIntersectionOfNumberString(null);
  }).toThrow(TypeError(`${invalidValue}, ${expected} ${received}`));
});
