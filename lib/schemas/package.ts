import { z } from "zod";
export const packageSchema = z.object({
  id: z.string().cuid().optional(),
  slug: z.string().min(2).max(60).regex(/^[a-z0-9-]+$/, "lowercase-with-dashes"),
  name: z.string().min(2).max(80),
  tagline: z.string().max(120).optional().or(z.literal("")),
  price: z.coerce.number().int().nonnegative(),
  duration: z.string().max(60).optional().or(z.literal("")),
  features: z.array(z.string().min(1)).default([]),
  highlighted: z.coerce.boolean().default(false),
  active: z.coerce.boolean().default(true),
  order: z.coerce.number().int().default(0),
});
export type PackageInput = z.infer<typeof packageSchema>;
