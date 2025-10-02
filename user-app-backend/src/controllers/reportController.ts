
import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { getDailyProfit, getEnvelopeSummary, getKioscoProfitByCategory } from '../services/reportService';

export const getDailyProfitReport = async (req: AuthRequest, res: Response) => {
  try {
    const { period, year, month, week, date, startDate, endDate } = req.query;
    const dailyProfit = await getDailyProfit(period as string, Number(year), Number(month), Number(week), date as string, startDate as string, endDate as string);
    res.status(200).json(dailyProfit);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching daily profit report', error });
  }
};

export const getKioscoProfitByCategoryReport = async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const kioscoProfitByCategory = await getKioscoProfitByCategory(startDate as string, endDate as string);
    res.status(200).json(kioscoProfitByCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching kiosco profit by category report', error });
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
