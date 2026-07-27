import { z } from 'zod';

export const CertificateFieldsSchema = z.object({
  imageUrl: z.string().min(1),
  title: z.string().optional(),
  titleAr: z.string().optional(),
  issuer: z.string().optional(),
  issuerAr: z.string().optional(),
  issueDate: z.string().optional(),
  verifyUrl: z.string().optional(),
  isVisible: z.coerce.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});
