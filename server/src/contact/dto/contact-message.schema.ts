import { z } from 'zod';

// Public-submission shape — no status/sortOrder/bilingual fields like
// the content models, just what the contact form actually collects.
export const CreateContactMessageSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  whatsapp: z.string().max(50).optional(),
  message: z.string().min(1).max(5000),
});

export const ListContactMessagesSchema = z.object({
  isRead: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(50),
});

export const UpdateContactMessageSchema = z.object({
  isRead: z.boolean(),
});
