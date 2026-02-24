import React, { useState, useEffect } from "react";
import { useDashboard } from "../../hooks/useDashboard";
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

  // 3. Obtención de datos
  const {
    chartData,
    loading,
    error,
    todayProfit,
    currentMonthProfit,
    monthlyProjection,
    unreadNotesCount,
    envelopes,
    totalProfit,
    totalKioscoProfit,
    totalPfProfit,
    kioscoProfitByCategory,
    fetchKioscoProfitByCategory,
  } = useDashboard(period, year, month, week, selectedDate, startDate, endDate);

  return (
    <div className="container-fluid py-1">
      {/* Tarjetas Superiores de KPI */}
      <SummaryCards
        todayProfit={todayProfit}
        currentMonthProfit={currentMonthProfit}
        monthlyProjection={monthlyProjection}
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
              <Chart chartData={chartData} loading={loading} error={error} period={period} />
            </div>
            <div className="col-12 col-xl-4">
              <DistributionChart
                kioscoTotal={totalKioscoProfit}
                pfTotal={totalPfProfit}
                loading={loading}
              />
            </div>
          </div>

          <ProfitDashboard
            totalProfit={totalProfit}
            totalKioscoProfit={totalKioscoProfit}
            totalPfProfit={totalPfProfit}
            kioscoProfitByCategory={kioscoProfitByCategory}
            showKioscoProfitByCategory={showKioscoProfitByCategory}
            fetchKioscoProfitByCategory={fetchKioscoProfitByCategory}
            setShowKioscoProfitByCategory={setShowKioscoProfitByCategory}
            period={period}
            showBreakdown={showBreakdown}
            setShowBreakdown={setShowBreakdown}
          />
        </div>

        {/* Barra Lateral (3/12) */}
        <div className="col-lg-3">
          <NotesWidget unreadNotesCount={unreadNotesCount} />
          <Envelopes envelopes={envelopes} todayProfit={todayProfit} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
