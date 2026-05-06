import { Response } from 'express';

export const success = (res: Response, data: any, status = 200) => {
    return res.status(status).json({
        status: 'success',
        data
    });
};

export const error = (res: Response, message: string, status = 400) => {
    return res.status(status).json({
        status: 'error',
        message
    });
};