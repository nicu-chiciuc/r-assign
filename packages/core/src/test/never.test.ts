import { test, equal, notOk } from 'tap';
import { isNever, never } from '../src/lib/never';

test('isNever', () => {
  equal(isNever, never);

  notOk(isNever());
  notOk(isNever(null));
});
