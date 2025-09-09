import { Router } from 'express';
import { getExchangeRatesController } from '../controllers/exchangeRateController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.get('/:countryCode', protect, getExchangeRatesController);

export default router;
