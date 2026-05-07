import { z } from 'zod';

export const CreateStockItemSchema = z.object({
    name: z.string().min(1, 'Item name is required'),
    quantity: z.number().positive('Quantity must be positive'),
    buyPrice: z.number().positive('Buy price must be positive'),
    sellPrice: z.number().positive('Sell price must be positive'),
    currency: z.enum(['USD', 'ZiG']).default('USD'),
    reorderLevel: z.number().default(5)
});

export const RecordSaleSchema = z.object({
    quantity: z.number().positive('Quantity must be positive'),
    paymentMode: z.enum(['cash', 'ecocash', 'zig', 'usd']).default('cash')
});

export type CreateStockItemInput = z.infer<typeof CreateStockItemSchema>;
export type RecordSaleInput = z.infer<typeof RecordSaleSchema>;