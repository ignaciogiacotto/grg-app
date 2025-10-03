import React from 'react';

type Period = "day" | "week" | "month" | "year" | "range";

interface FiltersProps {
  period: Period;
  setPeriod: (period: Period) => void;
  year: number;
  setYear: (year: number) => void;
  month: number;
  setMonth: (month: number) => void;
  week: number;
  setWeek: (week: number) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
}

const Filters: React.FC<FiltersProps> = ({
  period,
  setPeriod,
  year,
  setYear,
  month,
  setMonth,
  week,
  setWeek,
  selectedDate,
  setSelectedDate,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
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
      </div>
    </div>
  );
};

export default Filters;
