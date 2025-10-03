import React, { useState, useEffect } from "react";
import { useDashboard } from "../../hooks/useDashboard";
import Envelopes from "./Envelopes";
import ProfitDashboard from "./ProfitDashboard";
import Filters from "./Filters";
import Chart from "./Chart";

type Period = "day" | "week" | "month" | "year" | "range";

const currentYear = new Date().getFullYear();

const Dashboard: React.FC = () => {
  const [period, setPeriod] = useState<Period>("month");
  const [year, setYear] = useState<number>(currentYear);
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [week, setWeek] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const [showTodayProfit, setShowTodayProfit] = useState(() => {
    const saved = localStorage.getItem("showTodayProfit");
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [showMonthProfit, setShowMonthProfit] = useState(() => {
    const saved = localStorage.getItem("showMonthProfit");
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [showKioscoProfitByCategory, setShowKioscoProfitByCategory] =
    useState(false);

  useEffect(() => {
    localStorage.setItem("showTodayProfit", JSON.stringify(showTodayProfit));
  }, [showTodayProfit]);

  useEffect(() => {
    localStorage.setItem("showMonthProfit", JSON.stringify(showMonthProfit));
  }, [showMonthProfit]);

  const {
    chartData,
    loading,
    error,
    todayProfit,
    currentMonthProfit,
    envelopes,
    rangeProfit,
    rangeProfitKiosco,
    rangeProfitPf,
    kioscoProfitByCategory,
    fetchKioscoProfitByCategory,
  } = useDashboard(period, year, month, week, selectedDate, startDate, endDate);

  return (
    <div className="container-fluid py-4">
      <div className="row g-4">
        <div className="col-md-5">
          <Envelopes envelopes={envelopes} todayProfit={todayProfit} />
        </div>
        <div className="col-md-7">
          <ProfitDashboard
            todayProfit={todayProfit}
            currentMonthProfit={currentMonthProfit}
            showTodayProfit={showTodayProfit}
            setShowTodayProfit={setShowTodayProfit}
            showMonthProfit={showMonthProfit}
            setShowMonthProfit={setShowMonthProfit}
            rangeProfit={rangeProfit}
            rangeProfitKiosco={rangeProfitKiosco}
            rangeProfitPf={rangeProfitPf}
            kioscoProfitByCategory={kioscoProfitByCategory}
            showKioscoProfitByCategory={showKioscoProfitByCategory}
            fetchKioscoProfitByCategory={fetchKioscoProfitByCategory}
            setShowKioscoProfitByCategory={setShowKioscoProfitByCategory}
            period={period}
          />
          <Filters
            period={period}
            setPeriod={setPeriod}
            year={year}
            setYear={setYear}
            month={month}
            setMonth={setMonth}
            week={week}
            setWeek={setWeek}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
          <Chart chartData={chartData} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;