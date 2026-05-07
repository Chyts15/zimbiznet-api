import { Router } from 'express';
import * as StockController from './stock.controller';

const router = Router({ mergeParams: true });

router.post('/items',                StockController.addItem);
router.get('/items',                 StockController.listItems);
router.get('/items/low',             StockController.lowStock);
router.put('/items/:itemId/sell',    StockController.sell);
router.get('/summary',               StockController.summary);

export default router;