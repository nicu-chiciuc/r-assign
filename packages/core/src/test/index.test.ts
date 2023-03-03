import { rAssign } from '../index';

test('No arguments', () => {
  expect(() => {
    // @ts-expect-error - Expect throw
    rAssign();
  }).toThrow;
});

test('Invalid schema', () => {
  expect(() => {
    // @ts-expect-error - Expect throw
    rAssign({ data: null }, {});
  }).toThrow;
});

test('Schema with skipped property', () => {
  expect(
    rAssign(
      {
        data: () => {
          /* Return nothing */
        },
      },
      {}
    )
  ).toEqual({});
});

test('Schema with one property', () => {
  expect(rAssign({ data: () => null }, {})).toEqual({ data: null });
});

test('Schema with inherited properties', () => {
  const schema = Object.create({ prop: false });

  schema.data = () => null;

  expect(rAssign(schema, {})).toEqual({ data: null });
});

test('Schema with object applied', () => {
  expect(
    rAssign(
      {
        data: (value) => value,
      },
      { data: 'data' }
    )
  ).toEqual({ data: 'data' });
});

test('Schema with object applied, property skipped', () => {
  expect(
    rAssign(
      {
        data: () => {
          /* Return nothing */
        },
      },
      { data: 'data' }
    )
  ).toEqual({});
});

test('Schema with two objects applied', () => {
  expect(
    rAssign(
      {
        data: (value) => value,
      },
      { data: 'data' },
      { data: 'data2' }
    )
  ).toEqual({ data: 'data2' });
});

test('Schema with two objects applied, property skipped', () => {
  expect(
    rAssign(
      {
        data: () => {
          /* Return nothing */
        },
      },
      { data: 'data' },
      { data: 'data2' }
    )
  ).toEqual({});
});
