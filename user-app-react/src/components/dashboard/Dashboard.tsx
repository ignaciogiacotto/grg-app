import React, { useState, useEffect, useMemo } from "react";
import {
  useDailyProfitReportQuery,
  useEnvelopeSummaryQuery,
  useDashboardSummaryStatsQuery,
  useKioscoProfitByCategoryQuery,
} from "../../hooks/useDashboardQuery";
import { useUnreadNotesCountQuery } from "../../hooks/useNotes";
import Envelopes from "./Envelopes";
import ProfitDashboard from "./ProfitDashboard";
import Filters from "./Filters";
import Chart from "./Chart";
import DistributionChart from "./DistributionChart";
import SummaryCards from "./SummaryCards";
import NotesWidget from "./NotesWidget";

type Period = "day" | "week" | "month" | "year" | "range";

const getISOWeek = (date: Date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

const Dashboard: React.FC = () => {
  // 1. Estado de Filtros
  const [period, setPeriod] = useState<Period>("month");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [week, setWeek] = useState<number>(getISOWeek(new Date()));
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split("T")[0]);
  
  // 2. Estado de UI
  const [showKioscoProfitByCategory, setShowKioscoProfitByCategory] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState<boolean>(() => {
    const saved = localStorage.getItem("showProfitBreakdown");
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Guardar preferencia en localStorage
  useEffect(() => {
    localStorage.setItem("showProfitBreakdown", JSON.stringify(showBreakdown));
  }, [showBreakdown]);

  // 3. Obtención de datos con TanStack Query
  const { data: reportData = [], isLoading: loadingReport, error: reportError, refetch: refetchReport } = 
    useDailyProfitReportQuery(period, year, month, week, selectedDate, startDate, endDate);
  
  const { data: summaryStats, isLoading: loadingStats } = useDashboardSummaryStatsQuery();
  const { data: unreadNotesCount = 0 } = useUnreadNotesCountQuery();
  const { data: envelopes } = useEnvelopeSummaryQuery();
  const { data: kioscoProfitByCategory, isLoading: loadingCategory } = 
    useKioscoProfitByCategoryQuery(startDate, endDate, period === "range");

  // 4. Procesamiento de datos (reemplaza lógica de useDashboard)
  const totals = useMemo(() => {
    const kTotal = reportData.reduce((acc, curr) => acc + curr.kioscoProfit, 0);
    const pfTotal = reportData.reduce((acc, curr) => acc + curr.pfProfit, 0);
    return {
      kiosco: kTotal,
      pf: pfTotal,
      total: kTotal + pfTotal
    };
  }, [reportData]);

  const chartData = useMemo(() => {
    const labels = reportData.map((d) => {
      const date = new Date(d.date);
      if (period === "month") {
        return date.getUTCDate().toString();
      }
      if (period === "week") {
        return date.toLocaleDateString("es-AR", { weekday: "short", day: "numeric", timeZone: "UTC" });
      }
      return date.toLocaleDateString("es-AR", { timeZone: "UTC" });
    });

    const kioscoProfits = reportData.map((d) => d.kioscoProfit);
    const pfProfits = reportData.map((d) => d.pfProfit);

    return {
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
    };
  }, [reportData, period]);

  return (
    <div className="container-fluid py-1">
      {/* Tarjetas Superiores de KPI */}
      <SummaryCards
        todayProfit={summaryStats?.todayProfit || 0}
        currentMonthProfit={summaryStats?.currentMonthProfit || 0}
        monthlyProjection={summaryStats?.monthlyProjection || 0}
      />

      <div className="row g-2">
        {/* Área de Contenido Principal (8/12 o 9/12) */}
        <div className="col-lg-9">
          <Filters
            period={period} setPeriod={setPeriod}
            year={year} setYear={setYear}
            month={month} setMonth={setMonth}
            week={week} setWeek={setWeek}
            selectedDate={selectedDate} setSelectedDate={setSelectedDate}
            startDate={startDate} setStartDate={setStartDate}
            endDate={endDate} setEndDate={setEndDate}
          />

          <div className="row g-3 mb-2">
            <div className="col-12 col-xl-8">
              <Chart chartData={chartData} loading={loadingReport} error={reportError ? "Failed to fetch report data" : null} period={period} />
            </div>
            <div className="col-12 col-xl-4">
              <DistributionChart
                kioscoTotal={totals.kiosco}
                pfTotal={totals.pf}
                loading={loadingReport}
              />
            </div>
          </div>

          <ProfitDashboard
            totalProfit={totals.total}
            totalKioscoProfit={totals.kiosco}
            totalPfProfit={totals.pf}
            kioscoProfitByCategory={kioscoProfitByCategory || null}
            showKioscoProfitByCategory={showKioscoProfitByCategory}
            fetchKioscoProfitByCategory={() => {}} // Now handled automatically by the query with enabled: period === "range"
            setShowKioscoProfitByCategory={setShowKioscoProfitByCategory}
            period={period}
            showBreakdown={showBreakdown}
            setShowBreakdown={setShowBreakdown}
          />
        </div>

        {/* Barra Lateral (3/12) */}
        <div className="col-lg-3">
          <NotesWidget unreadNotesCount={unreadNotesCount} />
          <Envelopes envelopes={envelopes || null} todayProfit={summaryStats?.todayProfit || 0} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
