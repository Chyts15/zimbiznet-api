import { Request, Response } from 'express';
import { CreateStockItemSchema, RecordSaleSchema } from './stock.model';
import * as StockService from './stock.service';
import { success, error } from '../../utils/apiResponse';

export const addItem = async (req: Request, res: Response) => {
    const { businessId } = req.params;
    const parsed = CreateStockItemSchema.safeParse(req.body);
    if (!parsed.success) {
        return error(res, parsed.error.errors[0].message, 400);
    }
    try {
        const item = await StockService.addStockItem(businessId, parsed.data);
        return success(res, item, 201);
    } catch {
        return error(res, 'Something went wrong', 500);
    }
};

export const listItems = async (req: Request, res: Response) => {
    const { businessId } = req.params;
    const items = await StockService.getStockItems(businessId);
    return success(res, { count: items.length, items });
};

export const lowStock = async (req: Request, res: Response) => {
    const { businessId } = req.params;
    const items = await StockService.getLowStockItems(businessId);
    return success(res, { count: items.length, items });
};

export const sell = async (req: Request, res: Response) => {
    const { businessId, itemId } = req.params;
    const parsed = RecordSaleSchema.safeParse(req.body);
    if (!parsed.success) {
        return error(res, parsed.error.errors[0].message, 400);
    }
    try {
        const result = await StockService.recordSale(businessId, itemId, parsed.data);
        return success(res, result);
    } catch (err: any) {
        if (err.message === 'ITEM_NOT_FOUND') {
            return error(res, 'Stock item not found', 404);
        }
        if (err.message === 'INSUFFICIENT_STOCK') {
            return error(res, 'Not enough stock to complete this sale', 400);
        }
        return error(res, 'Something went wrong', 500);
    }
};

export const summary = async (req: Request, res: Response) => {
    const { businessId } = req.params;
    const period = (req.query.period as string) || 'today';
    const result = await StockService.getSalesSummary(businessId, period);
    return success(res, result);
};