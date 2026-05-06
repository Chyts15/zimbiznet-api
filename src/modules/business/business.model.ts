import { z } from 'zod';

export const CreateBusinessSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    type: z.enum([
        'farmer',
        'artisan',
        'service_worker',
        'micro_trader',
        'sme'
    ]),
    phone: z.string().min(9, 'Enter a valid phone number'),
    city: z.string().min(2, 'City is required'),
    province: z.string().optional(),
    description: z.string().optional(),
    currency: z.enum(['USD', 'ZiG']).default('USD')
});

export type CreateBusinessInput = z.infer<typeof CreateBusinessSchema>;