import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface KioscoProfitByCategory {
  facturaB: number;
  remitos: number;
  cyber: number;
  cargasVirtuales: number;
}

interface ProfitDashboardProps {
  todayProfit: number;
  currentMonthProfit: number;
  showTodayProfit: boolean;
  setShowTodayProfit: (show: boolean) => void;
  showMonthProfit: boolean;
  setShowMonthProfit: (show: boolean) => void;
  rangeProfit: number;
  rangeProfitKiosco: number;
  rangeProfitPf: number;
  kioscoProfitByCategory: KioscoProfitByCategory | null;
  showKioscoProfitByCategory: boolean;
  fetchKioscoProfitByCategory: () => void;
  setShowKioscoProfitByCategory: (show: boolean) => void;
  period: string;
}

const ProfitDashboard: React.FC<ProfitDashboardProps> = ({
  todayProfit,
  currentMonthProfit,
  showTodayProfit,
  setShowTodayProfit,
  showMonthProfit,
  setShowMonthProfit,
  rangeProfit,
  rangeProfitKiosco,
  rangeProfitPf,
  kioscoProfitByCategory,
  showKioscoProfitByCategory,
  fetchKioscoProfitByCategory,
  setShowKioscoProfitByCategory,
  period,
}) => {
  return (
    <>
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
    </>
  );
};

export default ProfitDashboard;
