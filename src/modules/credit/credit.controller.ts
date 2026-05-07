import { Request, Response } from 'express';
import { CreateCustomerSchema, CreateCreditEntrySchema } from './credit.model';
import * as CreditService from './credit.service';
import { success, error } from '../../utils/apiResponse';

export const addCustomer = async (req: Request, res: Response) => {
    const { businessId } = req.params;
    const parsed = CreateCustomerSchema.safeParse(req.body);
    if (!parsed.success) {
        return error(res, parsed.error.errors[0].message, 400);
    }
    try {
        const customer = await CreditService.addCustomer(businessId, parsed.data);
        return success(res, customer, 201);
    } catch {
        return error(res, 'Something went wrong', 500);
    }
};

export const listCustomers = async (req: Request, res: Response) => {
    const { businessId } = req.params;
    const customers = await CreditService.getCustomers(businessId);
    return success(res, { count: customers.length, customers });
};

export const addEntry = async (req: Request, res: Response) => {
    const { customerId } = req.params;
    const parsed = CreateCreditEntrySchema.safeParse(req.body);
    if (!parsed.success) {
        return error(res, parsed.error.errors[0].message, 400);
    }
    try {
        const entry = await CreditService.addCreditEntry(customerId, parsed.data);
        return success(res, entry, 201);
    } catch {
        return error(res, 'Something went wrong', 500);
    }
};

export const getBalance = async (req: Request, res: Response) => {
    const { customerId } = req.params;
    try {
        const balance = await CreditService.getCustomerBalance(customerId);
        return success(res, balance);
    } catch (err: any) {
        if (err.message === 'CUSTOMER_NOT_FOUND') {
            return error(res, 'Customer not found', 404);
        }
        return error(res, 'Something went wrong', 500);
    }
};

export const markPaid = async (req: Request, res: Response) => {
    const { entryId } = req.params;
    try {
        const entry = await CreditService.markAsPaid(entryId);
        return success(res, entry);
    } catch {
        return error(res, 'Entry not found', 404);
    }
};

export const overdueList = async (req: Request, res: Response) => {
    const { businessId } = req.params;
    const overdue = await CreditService.getOverdue(businessId);
    return success(res, { count: overdue.length, overdue });
};