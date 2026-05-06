import { Request, Response } from 'express';
import { CreateBusinessSchema } from './business.model';
import * as BusinessService from './business.service';
import { success, error } from '../../utils/apiResponse';

export const register = async (req: Request, res: Response) => {
    const parsed = CreateBusinessSchema.safeParse(req.body);
    if (!parsed.success) {
        return error(res, parsed.error.errors[0].message, 400);
    }
    try {
        const business = await BusinessService.createBusiness(parsed.data);
        return success(res, business, 201);
    } catch (err: any) {
        if (err.code === 'P2002') {
            return error(res, 'A business with that phone number already exists', 409);
        }
        return error(res, 'Something went wrong', 500);
    }
};

export const getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const business = await BusinessService.getBusinessById(id);
    if (!business) {
        return error(res, 'Business not found', 404);
    }
    return success(res, business);
};

export const search = async (req: Request, res: Response) => {
    const { type, city, province } = req.query as Record<string, string>;
    const results = await BusinessService.searchBusinesses({ type, city, province });
    return success(res, { count: results.length, businesses: results });
};