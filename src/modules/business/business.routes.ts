import { Router } from 'express';
import * as BusinessController from './business.controller';

const router = Router();

router.post('/',        BusinessController.register);
router.get('/search',  BusinessController.search);
router.get('/:id',     BusinessController.getById);

export default router;