import { z } from 'zod';

export const organizationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  website: z.string().url('Invalid website URL'),
  industry: z.string().min(2, 'Industry is required'),
  targetAudience: z.string().min(2, 'Target audience is required'),
  targetGeography: z.string().min(2, 'Target geography is required'),
  services: z.array(z.string()).min(1, 'At least one service is required'),
  competitors: z.array(z.string().url('Competitor must be a valid URL')).optional(),
  currentKeywords: z.array(z.string()).optional(),
});

export type OrganizationInput = z.infer<typeof organizationSchema>;
