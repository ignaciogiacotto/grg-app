import { Request, Response } from 'express';
import { getExchangeRates } from '../services/exchangeRateService';

export const getExchangeRatesController = async (req: Request, res: Response) => {
  try {
    const { countryCode } = req.params;
    const rate = await getExchangeRates(countryCode);
    res.json(rate);
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Failed to get exchange rates', error: error.message });
    } else {
        res.status(500).json({ message: 'Failed to get exchange rates', error: 'An unknown error occurred' });
    }
  }
};
