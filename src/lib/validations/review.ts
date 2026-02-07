import { z } from 'zod';

/**
 * Review Validation Schema
 * @description Validates star rating and comment length.
 */
export const reviewSchema = z.object({
  star: z
    .number()
    .min(1, 'Please select at least 1 star')
    .max(5, 'Maximum rating is 5 stars'),
  comment: z
    .string()
    .min(1, 'Please share your thoughts about our service!')
    .max(500, 'Comment is too long (maximum 500 characters)'),
});

export type ReviewType = z.infer<typeof reviewSchema>;
