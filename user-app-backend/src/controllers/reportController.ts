
import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { getDailyProfit, getEnvelopeSummary } from '../services/reportService';

export const getDailyProfitReport = async (req: AuthRequest, res: Response) => {
  try {
    const { period, year, month, week } = req.query;
    const dailyProfit = await getDailyProfit(period as string, Number(year), Number(month), Number(week));
    res.status(200).json(dailyProfit);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching daily profit report', error });
  }
};

export const getEnvelopeSummaryReport = async (req: AuthRequest, res: Response) => {
  try {
    const summary = await getEnvelopeSummary();
    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching envelope summary', error });
  }
};
