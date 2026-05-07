import { z } from 'zod';

export const CreateCustomerSchema = z.object({
    name: z.string().min(1, 'Customer name is required'),
    phone: z.string().optional()
});

export const CreateCreditEntrySchema = z.object({
    description: z.string().min(1, 'Description is required'),
    amount: z.number().positive('Amount must be positive'),
    currency: z.enum(['USD', 'ZiG']).default('USD'),
    dueDate: z.string().optional()
});

export type CreateCustomerInput = z.infer<typeof CreateCustomerSchema>;
export type CreateCreditEntryInput = z.infer<typeof CreateCreditEntrySchema>;