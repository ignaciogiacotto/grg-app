import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useDashboard } from "../../hooks/useDashboard";
import { Spinner } from "react-bootstrap";
import { Eye, EyeOff } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

  const options = {
    plugins: { title: { display: false } },
    responsive: true,
    maintainAspectRatio: false,
    scales: { x: { stacked: true }, y: { stacked: true } },
  };

  const renderFilters = () => {
    switch (period) {
      case "day":
        return (
          <div className="col-md-3">
            <label htmlFor="date-select" className="form-label">
              Fecha
            </label>
            <input
              id="date-select"
              type="date"
              className="form-control"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        );
      case "range":
        return (
          <>
            <div className="col-md-3">
              <label htmlFor="start-date-select" className="form-label">
                Desde
              </label>
              <input
                id="start-date-select"
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="end-date-select" className="form-label">
                Hasta
              </label>
              <input
                id="end-date-select"
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </>
        );
      case "year":
        return (
          <div className="col-md-3">
            <label htmlFor="year-select" className="form-label">
              Año
            </label>
            <input
              id="year-select"
              type="number"
              className="form-control"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            />
          </div>
        );
      case "month":
        return (
          <>
            <div className="col-md-3">
              <label htmlFor="month-select" className="form-label">
                Mes
              </label>
              <select
                id="month-select"
                className="form-select"
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}>
                {Array.from(Array(12).keys()).map((m) => (
                  <option key={m + 1} value={m + 1}>
                    {m + 1}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label htmlFor="year-select-month" className="form-label">
                Año
              </label>
              <input
                id="year-select-month"
                type="number"
                className="form-control"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              />
            </div>
          </>
        );
      case "week":
        return (
          <>
            <div className="col-md-3">
              <label htmlFor="week-select" className="form-label">
                Semana
              </label>
              <input
                id="week-select"
                type="number"
                className="form-control"
                value={week}
                onChange={(e) => setWeek(Number(e.target.value))}
                min={1}
                max={53}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="year-select-week" className="form-label">
                Año
              </label>
              <input
                id="year-select-week"
                type="number"
                className="form-control"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row g-4">
        {/* Left Column: Envelopes */}
        <div className="col-md-5">
          <h4 className="mb-3">Gestión de Sobres</h4>
          <div className="row row-cols-1 g-3">
            <div className="col">
              <div className="card border-primary shadow-sm">
                <div className="card-body d-flex align-items-center">
                  <i className="bi bi-box-seam me-3 text-primary fs-3"></i>
                  <div>
                    <h6 className="card-subtitle mb-1"> Sobre Cigarrillos</h6>
                    <h4 className="mb-0">
                      ${envelopes?.cigarettes.toLocaleString("es-AR") || "0"}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card border-success shadow-sm">
                <div className="card-body d-flex align-items-center">
                  <i className="bi bi-phone-fill me-3 text-success fs-3"></i>
                  <div>
                    <h6 className="card-subtitle mb-1">Sobre Telerecargas</h6>
                    <h4 className="mb-0">
                      ${envelopes?.recharges.toLocaleString("es-AR") || "0"}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card border-dark shadow-sm">
                <div className="card-body d-flex align-items-center">
                  <i className="bi bi-wallet2 me-3 text-dark fs-3"></i>
                  <div>
                    <h6 className="card-subtitle mb-1">Sobre GRG</h6>
                    <h4 className="mb-0">
                      ${todayProfit.toLocaleString("es-AR") || "0"}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Profit Dashboard */}
        <div className="col-md-7">
          <h4 className="mb-3">Dashboard de Ganancias</h4>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="card text-bg-success shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="card-subtitle mb-2">
                      Ganancia Total del Día
                    </h6>
                    <div
                      onClick={() => setShowTodayProfit(!showTodayProfit)}
                      style={{ cursor: "pointer" }}>
                      {showTodayProfit ? (
                        <Eye size={20} />
                      ) : (
                        <EyeOff size={20} />
                      )}
                    </div>
                  </div>
                  <h3 className="mb-0">
                    {showTodayProfit
                      ? `${todayProfit.toLocaleString("es-AR")}`
                      : "$****"}
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card text-bg-primary shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="card-subtitle mb-2">
                      Ganancia Total del Mes
                    </h6>
                    <div
                      onClick={() => setShowMonthProfit(!showMonthProfit)}
                      style={{ cursor: "pointer" }}>
                      {showMonthProfit ? (
                        <Eye size={20} />
                      ) : (
                        <EyeOff size={20} />
                      )}
                    </div>
                  </div>
                  <h3 className="mb-0">
                    {showMonthProfit
                      ? `${currentMonthProfit.toLocaleString("es-AR")}`
                      : "$****"}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Period Filters */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="row align-items-end g-3">
                <div className="col-md-auto">
                  <div className="btn-group" role="group">
                    <button
                      type="button"
                      className={`btn ${
                        period === "day" ? "btn-primary" : "btn-outline-primary"
                      }`}
                      onClick={() => setPeriod("day")}>
                      Día
                    </button>
                    <button
                      type="button"
                      className={`btn ${
                        period === "week"
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => setPeriod("week")}>
                      Semana
                    </button>
                    <button
                      type="button"
                      className={`btn ${
                        period === "month"
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => setPeriod("month")}>
                      Mes
                    </button>
                    <button
                      type="button"
                      className={`btn ${
                        period === "year"
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => setPeriod("year")}>
                      Año
                    </button>
                    <button
                      type="button"
                      className={`btn ${
                        period === "range"
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => setPeriod("range")}>
                      Rango
                    </button>
                  </div>
                </div>
                {renderFilters()}
              </div>
              {period === "range" && (
                <div className="mt-3">
                  <h4 className="mb-3">Ganancias del Rango</h4>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <div
                        className="card text-bg-info shadow-sm"
                        onClick={() => {
                          if (period === "range") {
                            fetchKioscoProfitByCategory();
                            setShowKioscoProfitByCategory(
                              !showKioscoProfitByCategory
                            );
                          }
                        }}
                        style={{
                          cursor: period === "range" ? "pointer" : "default",
                        }}>
                        <div className="card-body">
                          <h6 className="card-subtitle mb-2">
                            Ganancia Kiosco
                          </h6>
                          <h3 className="mb-0">
                            ${rangeProfitKiosco.toLocaleString("es-AR")}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="card text-bg-danger shadow-sm">
                        <div className="card-body">
                          <h6 className="card-subtitle mb-2">Ganancia PF</h6>
                          <h3 className="mb-0">
                            ${rangeProfitPf.toLocaleString("es-AR")}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="card text-bg-warning shadow-sm">
                        <div className="card-body">
                          <h6 className="card-subtitle mb-2">Ganancia Total</h6>
                          <h3 className="mb-0">
                            ${rangeProfit.toLocaleString("es-AR")}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {showKioscoProfitByCategory && kioscoProfitByCategory && (
                <div className="mt-3">
                  <h4 className="mb-3">Ganancias por Categoría</h4>
                  <div className="row g-3">
                    <div className="col-md-3 d-flex">
                      <div className="card text-bg-light shadow-sm w-100 h-100">
                        <div className="card-body">
                          <h6 className="card-subtitle mb-2">
                            Ganancia Factura B
                          </h6>
                          <h3 className="mb-0">
                            $
                            {kioscoProfitByCategory.facturaB.toLocaleString(
                              "es-AR"
                            )}
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 d-flex">
                      <div className="card text-bg-light shadow-sm w-100 h-100">
                        <div className="card-body">
                          <h6 className="card-subtitle mb-2">
                            Ganancia Remitos
                          </h6>
                          <h3 className="mb-0">
                            $
                            {kioscoProfitByCategory.remitos.toLocaleString(
                              "es-AR"
                            )}
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 d-flex">
                      <div className="card text-bg-light shadow-sm w-100 h-100">
                        <div className="card-body">
                          <h6 className="card-subtitle mb-2">Cyber</h6>
                          <h3 className="mb-0">
                            $
                            {kioscoProfitByCategory.cyber.toLocaleString(
                              "es-AR"
                            )}
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 d-flex">
                      <div className="card text-bg-light shadow-sm w-100 h-100">
                        <div className="card-body">
                          <h6 className="card-subtitle mb-2">
                            Cargas Virtuales
                          </h6>
                          <h3 className="mb-0">
                            $
                            {kioscoProfitByCategory.cargasVirtuales.toLocaleString(
                              "es-AR"
                            )}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chart */}
          <div className="card shadow-sm" style={{ height: "400px" }}>
            <div className="card-body">
              {loading && (
                <div className="d-flex justify-content-center align-items-center h-100">
                  <Spinner animation="border" variant="primary" />
                  <span className="ms-2">Cargando gráfico...</span>
                </div>
              )}
              {error && <div className="alert alert-danger mb-0">{error}</div>}
              {!loading && !error && (
                <div style={{ height: "100%" }}>
                  <Bar options={options} data={chartData} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
