import { useQuery } from '@tanstack/react-query';
import * as reportService from '../services/reportService';

export const useDailyProfitReportQuery = (
  period: "day" | "week" | "month" | "year" | "range",
  year: number,
  month: number,
  week: number,
  selectedDate: string,
  startDate: string,
  endDate: string
) => {
  return useQuery({
    queryKey: ['dailyProfitReport', period, year, month, week, selectedDate, startDate, endDate],
    queryFn: () => reportService.getDailyProfitReport(period, year, month, week, selectedDate, startDate, endDate),
  });
};

export const useEnvelopeSummaryQuery = () => {
  return useQuery({
    queryKey: ['envelopeSummary'],
    queryFn: reportService.getEnvelopeSummary,
  });
};

export const useKioscoProfitByCategoryQuery = (startDate: string, endDate: string, enabled: boolean) => {
  return useQuery({
    queryKey: ['kioscoProfitByCategory', startDate, endDate],
    queryFn: () => reportService.getKioscoProfitByCategoryReport(startDate, endDate),
    enabled: enabled && !!startDate && !!endDate,
  });
};

export const useDashboardSummaryStatsQuery = () => {
  return useQuery({
    queryKey: ['dashboardSummaryStats'],
    queryFn: async () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const todayStr = now.toISOString().split("T")[0];

      const monthData = await reportService.getDailyProfitReport("month", year, month);

      const monthTotal = monthData.reduce(
        (acc, curr) => acc + curr.kioscoProfit + curr.pfProfit,
        0,
      );

      // Calculation for Monthly Projection
      const currentDay = now.getDate();
      const totalDaysInMonth = new Date(year, month, 0).getDate();
      const projection = (monthTotal / currentDay) * totalDaysInMonth;

      const todayData = monthData.find((d) => d.date.startsWith(todayStr));
      const todayTotal = todayData
        ? todayData.kioscoProfit + todayData.pfProfit
        : 0;

      return {
        todayProfit: todayTotal,
        currentMonthProfit: monthTotal,
        monthlyProjection: projection,
      };
    },
    refetchInterval: 60000, // Refresh summary stats every minute
  });
};
