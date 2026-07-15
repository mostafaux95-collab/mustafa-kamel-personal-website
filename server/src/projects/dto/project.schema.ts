import { z } from 'zod';
import { ContentStatus } from '../../../generated/prisma/client';

const metricSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
  labelAr: z.string().optional(),
});

// Shared field set for create/update. Update uses .partial() so PATCH
// semantics work (only send what changed).
export const ProjectFieldsSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Slug must be lowercase, hyphen-separated'),
  title: z.string().min(1),
  titleAr: z.string().optional(),
  company: z.string().min(1),
  tagline: z.string().min(1),
  taglineAr: z.string().optional(),
  role: z.string().min(1),
  roleAr: z.string().optional(),
  category: z.string().min(1),
  year: z.string().min(1),
  coverGradientFrom: z.string().min(1),
  coverGradientTo: z.string().min(1),
  challenge: z.string().min(1),
  challengeAr: z.string().optional(),
  solution: z.string().min(1),
  solutionAr: z.string().optional(),
  metrics: z.array(metricSchema).default([]),
  techStack: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  hasCaseStudy: z.boolean().default(false),
  metaTitle: z.string().optional(),
  metaTitleAr: z.string().optional(),
  metaDescription: z.string().optional(),
  metaDescriptionAr: z.string().optional(),
  status: z.nativeEnum(ContentStatus).default(ContentStatus.DRAFT),
  featured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
});
