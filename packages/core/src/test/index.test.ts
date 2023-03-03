import { test, match, throws } from 'tap';
import { rAssign } from '../src';

test('No arguments', () => {
  throws(() => {
    // @ts-expect-error
    rAssign();
  });
});

test('Invalid schema', () => {
  throws(() => {
    // @ts-expect-error
    rAssign({ data: null }, {});
  });
});

test('Schema with skipped property', () => {
  match(
    rAssign(
      {
        data: () => {
          /* Return nothing */
        },
      },
      {}
    ),
    {}
  );
});

test('Schema with one property', () => {
  match(rAssign({ data: () => null }, {}), { data: null });
});

test('Schema with inherited properties', () => {
  const schema = Object.create({ prop: false });

  schema.data = () => null;

  match(rAssign(schema, {}), { data: null });
});

test('Schema with object applied', () => {
  match(
    rAssign(
      {
        data: (value) => value,
      },
      { data: 'data' }
    ),
    { data: 'data' }
  );
});

test('Schema with object applied, property skipped', () => {
  match(
    rAssign(
      {
        data: () => {
          /* Return nothing */
        },
      },
      { data: 'data' }
    ),
    {}
  );
});

test('Schema with two objects applied', () => {
  match(
    rAssign(
      {
        data: (value) => value,
      },
      { data: 'data' },
      { data: 'data2' }
    ),
    { data: 'data2' }
  );
});

test('Schema with two objects applied, property skipped', () => {
  match(
    rAssign(
      {
        data: () => {
          /* Return nothing */
        },
      },
      { data: 'data' },
      { data: 'data2' }
    ),
    {}
  );
});
