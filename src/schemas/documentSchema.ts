import { z } from 'zod';

export const createDocumentSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),
  version: z
    .string()
    .min(1, 'Version is required')
    .regex(
      /^\d+\.\d+\.\d+$/,
      'Version must follow semantic format (e.g: 1.0.0)'
    ),
  files: z
    .array(z.string())
    .min(1, 'Must select at least one file')
    .max(10, 'Cannot select more than 10 files'),
});

export type CreateDocumentFormData = z.infer<typeof createDocumentSchema>;