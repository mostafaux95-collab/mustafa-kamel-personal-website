import { z, ZodDefault, type ZodObject, type ZodRawShape } from 'zod';

// Undo a `ZodDefault` wrapper (its inner type), otherwise pass through.
type StripDefault<T> = T extends ZodDefault<infer Inner> ? Inner : T;

type StrippedShape<Shape extends ZodRawShape> = {
  [K in keyof Shape]: StripDefault<Shape[K]>;
};

// Every content entity's "fields" schema applies `.default(...)` to
// array/boolean/enum columns so create-time payloads can omit them.
// Building the update schema via `fieldsSchema.partial()` does NOT
// clear those defaults — Zod still substitutes the default for any key
// missing from the input, so a real partial PATCH (omitting fields that
// didn't change) silently resets them instead of leaving them alone.
// This strips each field's default before partial-ing so `.optional()`
// alone governs "omitted = unchanged" PATCH semantics. The mapped
// return type keeps each field's real type (rather than widening
// everything to ZodTypeAny) so callers still get proper inference.
export function toUpdateSchema<Shape extends ZodRawShape>(schema: ZodObject<Shape>) {
  const stripped = Object.fromEntries(
    Object.entries(schema.shape).map(([key, value]) => [
      key,
      value instanceof ZodDefault ? value.removeDefault() : value,
    ]),
  ) as StrippedShape<Shape>;
  return z.object(stripped).partial();
}
