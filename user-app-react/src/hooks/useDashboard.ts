import { useState, useEffect } from "react";
import {
  getDailyProfitReport,
  DailyProfit,
  getEnvelopeSummary,
  EnvelopeSummary,
} from "../services/reportService";

type Period = "day" | "week" | "month" | "year" | "range";

export const useDashboard = (
  period: Period,
  year: number,
  month: number,
  week: number,
  selectedDate: string,
  startDate: string,
  endDate: string
) => {
  // --- STATE MANAGEMENT ---
  const [chartData, setChartData] = useState<any>({ labels: [], datasets: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [todayProfit, setTodayProfit] = useState<number>(0);
  const [currentMonthProfit, setCurrentMonthProfit] = useState<number>(0);
  const [rangeProfit, setRangeProfit] = useState<number>(0);
  const [rangeProfitKiosco, setRangeProfitKiosco] = useState<number>(0);
  const [rangeProfitPf, setRangeProfitPf] = useState<number>(0);
  const [envelopes, setEnvelopes] = useState<EnvelopeSummary | null>(null);

  // --- LOGIC FOR SUMMARY CARDS (Today & Current Month) ---
  useEffect(() => {
    const fetchSummaryData = async () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const todayStr = now.toISOString().split("T")[0];

      const monthData = await getDailyProfitReport("month", year, month);

      const monthTotal = monthData.reduce(
        (acc, curr) => acc + curr.kioscoProfit + curr.pfProfit,
        0
      );
      setCurrentMonthProfit(monthTotal);

      const todayData = monthData.find((d) => d.date.startsWith(todayStr));
      const todayTotal = todayData
        ? todayData.kioscoProfit + todayData.pfProfit
        : 0;
      setTodayProfit(todayTotal);
    };

    fetchSummaryData().catch(console.error);
  }, []);

  // --- LOGIC FOR ENVELOPE SUMMARY ---
  useEffect(() => {
    getEnvelopeSummary().then(setEnvelopes).catch(console.error);
  }, []);

  // --- LOGIC FOR MAIN CHART ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getDailyProfitReport(
          period,
          year,
          month,
          week,
          selectedDate,
          startDate,
          endDate
        );
        if (data) {
          if (period === "range") {
            const rangeKioscoTotal = data.reduce(
              (acc, curr) => acc + curr.kioscoProfit,
              0
            );
            const rangePfTotal = data.reduce(
              (acc, curr) => acc + curr.pfProfit,
              0
            );
            setRangeProfitKiosco(rangeKioscoTotal);
            setRangeProfitPf(rangePfTotal);
            setRangeProfit(rangeKioscoTotal + rangePfTotal);
          }
          const labels = data.map((d: DailyProfit) =>
            new Date(d.date).toLocaleDateString("es-AR", { timeZone: "UTC" })
          );
          const kioscoProfits = data.map((d: DailyProfit) => d.kioscoProfit);
          const pfProfits = data.map((d: DailyProfit) => d.pfProfit);
          setChartData({
            labels,
            datasets: [
              {
                label: "Ganancia Kiosco",
                data: kioscoProfits,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                stack: "Stack 0",
              },
              {
                label: "Ganancia PF",
                data: pfProfits,
                backgroundColor: "rgba(255, 99, 132, 0.6)",
                stack: "Stack 0",
              },
            ],
          });
        }
      } catch (err) {
        setError("Failed to fetch report data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [period, year, month, week, selectedDate, startDate, endDate]);

  // --- RETURN ALL STATE VALUES ---
  return {
    chartData,
    loading,
    error,
    todayProfit,
    currentMonthProfit,
    envelopes,
    rangeProfit,
    rangeProfitKiosco,
    rangeProfitPf,
  };
};
