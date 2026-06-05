import { z } from 'zod';

export const messageInputSchema = z.object({
  content: z.string().max(4000, 'Message must be at most 4000 characters'),
});

export type MessageInputFormValues = z.infer<typeof messageInputSchema>;
