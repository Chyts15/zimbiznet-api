import { Router } from 'express';
import * as CreditController from './credit.controller';

const router = Router({ mergeParams: true });

router.post('/customers',                    CreditController.addCustomer);
router.get('/customers',                     CreditController.listCustomers);
router.get('/customers/:customerId',         CreditController.getBalance);
router.post('/customers/:customerId/entries',CreditController.addEntry);
router.put('/entries/:entryId/pay',          CreditController.markPaid);
router.get('/overdue',                       CreditController.overdueList);

export default router;