import * as r from '@r-assign/core';
import * as z from 'zod';

const s: unknown = 4;

const zodSchema = z.object({
  number: z.number(),
  string: z.string(),
});

const rAssignSchema = r.object({
  number: r.number,
  string: r.string,
});

if (rAssignSchema(s)) {
  console.log(s.number);
  console.log(s.string);
}
