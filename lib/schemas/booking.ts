import { z } from "zod";
// يقبل: +2010xxxxxxxx أو 2010xxxxxxxx أو 010xxxxxxxx
export const PHONE_REGEX = /^(\+?20|0)?1[0-2,5]\d{8}$/;

export const bookingSchema = z.object({
  clientName: z.string().min(2, "Please enter your name").max(80),
  clientPhone: z.string().regex(PHONE_REGEX, "Enter a valid phone"),
  clientEmail: z.string().email().optional().or(z.literal("")),
  packageId: z.string().cuid().optional().or(z.literal("")),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date"),
  timeSlot: z.string().min(1, "Pick a time"),
  venue: z.string().min(3, "Where is the shoot?").max(160),
  guests: z.coerce.number().int().min(0).max(2000).optional(),
  notes: z.string().max(1000).optional(),
  paymentMethod: z.enum(["INSTAPAY","FAWRY","VODAFONE_CASH","ORANGE_CASH","BANK_TRANSFER","CASH"]).optional(),
});
export type BookingInput = z.infer<typeof bookingSchema>;

export const contactSchema = z.object({
  name: z.string().min(2).max(80),
  phone: z.string().regex(PHONE_REGEX),
  message: z.string().min(10).max(1000),
  preferredDate: z.string().optional(),
  company: z.string().max(0).optional().or(z.literal("")),
});
