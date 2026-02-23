import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

interface SummaryCardsProps {
  todayProfit: number;
  currentMonthProfit: number;
  monthlyProjection: number;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  todayProfit,
  currentMonthProfit,
  monthlyProjection,
}) => {
  const [showTodayProfit, setShowTodayProfit] = useState(() => {
    const saved = localStorage.getItem("showTodayProfit");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [showMonthProfit, setShowMonthProfit] = useState(() => {
    const saved = localStorage.getItem("showMonthProfit");
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("showTodayProfit", JSON.stringify(showTodayProfit));
  }, [showTodayProfit]);

  useEffect(() => {
    localStorage.setItem("showMonthProfit", JSON.stringify(showMonthProfit));
  }, [showMonthProfit]);

  return (
    <div className="row g-3 mb-2">
      {/* Ganancia Hoy */}
      <div className="col-md-4">
        <div className="card text-bg-success shadow-sm border-0 h-100">
          <div className="card-body py-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <h6 className="card-subtitle opacity-75">Ganancia Hoy</h6>
              <div onClick={() => setShowTodayProfit(!showTodayProfit)} style={{ cursor: "pointer" }}>
                {showTodayProfit ? <Eye size={18} /> : <EyeOff size={18} />}
              </div>
            </div>
            <h2 className="mb-0 fw-bold">
              {showTodayProfit ? `$${todayProfit.toLocaleString("es-AR")}` : "$****"}
            </h2>
          </div>
        </div>
      </div>

      {/* Ganancia Mes */}
      <div className="col-md-4">
        <div className="card text-bg-primary shadow-sm border-0 h-100">
          <div className="card-body py-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <h6 className="card-subtitle opacity-75">Ganancia Mes</h6>
              <div onClick={() => setShowMonthProfit(!showMonthProfit)} style={{ cursor: "pointer" }}>
                {showMonthProfit ? <Eye size={18} /> : <EyeOff size={18} />}
              </div>
            </div>
            <h2 className="mb-0 fw-bold">
              {showMonthProfit ? `$${currentMonthProfit.toLocaleString("es-AR")}` : "$****"}
            </h2>
          </div>
        </div>
      </div>

      {/* Proyección */}
      <div className="col-md-4">
        <div className="card text-bg-dark shadow-sm border-0 h-100">
          <div className="card-body py-3">
            <h6 className="card-subtitle mb-1 opacity-75">Proyección Mensual</h6>
            <h2 className="mb-0 fw-bold">
              ${Math.round(monthlyProjection).toLocaleString("es-AR")}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
