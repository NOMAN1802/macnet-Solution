import { z } from "zod";

export const leadSchema = z.object({
  type: z.enum(["QUOTE", "CONTACT"]),
  name: z.string().trim().min(2, "Please enter your name").max(120),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  email: z.email("Please enter a valid email").max(200),
  phone: z
    .string()
    .trim()
    .max(40)
    .regex(/^[+\d\s()-]*$/, "Use digits, spaces, + or -")
    .optional()
    .or(z.literal("")),
  message: z.string().trim().max(5000).optional().or(z.literal("")),
  productIds: z.array(z.string().regex(/^[a-f0-9]{24}$/)).max(50).default([]),
  source: z.string().max(200).optional(),
  // honeypot: real users never fill this
  website: z.string().max(0).optional().or(z.literal("")),
});

export type LeadInput = z.input<typeof leadSchema>;
