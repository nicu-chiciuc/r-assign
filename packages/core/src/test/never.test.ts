import { test, equal, notOk } from 'tap';
import { isNever, never } from '../lib/never';

test('isNever', () => {
  equal(isNever, never);

  notOk(isNever());
  notOk(isNever(null));
});
