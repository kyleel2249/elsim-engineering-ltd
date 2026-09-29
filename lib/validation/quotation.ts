import { z } from 'zod';

/**
 * Shared quotation schema.
 *
 * Imported by both the client form and the API route so validation rules exist
 * in exactly one place and cannot drift apart.
 */
export const quotationSchema = z.object({
  name: z.string().trim().min(2, 'Enter your full name').max(120),
  clientType: z.enum(['Individual', 'Company / organisation'], {
    errorMap: () => ({ message: 'Select whether you are an individual or a company / organisation' }),
  }),
  company: z.string().trim().max(160).optional().or(z.literal('')),
  email: z.string().trim().email('Enter a valid email address').max(200),
  telephone: z
    .string()
    .trim()
    .min(7, 'Enter a reachable telephone number')
    .max(32)
    .regex(/^[+()\d\s-]+$/, 'Use digits, spaces and + ( ) - only'),
  projectType: z.string().trim().max(64).optional().or(z.literal('')),
  serviceRequired: z.string().trim().min(1, 'Select the service you need'),
  projectLocation: z.string().trim().min(2, 'Enter the project location').max(160),
  projectDescription: z
    .string()
    .trim()
    .min(20, 'Give us at least a sentence or two about the project')
    .max(4000),
  estimatedTimeline: z.string().trim().max(64).optional().or(z.literal('')),
  budgetRange: z.string().trim().max(64).optional().or(z.literal('')),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'We need your consent before we can contact you' }),
  }),
  /** Honeypot: real people never fill this in. */
  website: z.string().max(0).optional().or(z.literal('')),
});

export type QuotationInput = z.infer<typeof quotationSchema>;

export interface QuotationResponse {
  ok: boolean;
  reference?: string;
  message: string;
  fieldErrors?: Record<string, string>;
}
