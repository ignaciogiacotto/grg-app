import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface KioscoProfitByCategory {
  facturaB: number;
  remitos: number;
  cyber: number;
  cargasVirtuales: number;
}

interface ProfitDashboardProps {
  totalProfit: number;
  totalKioscoProfit: number;
  totalPfProfit: number;
  kioscoProfitByCategory: KioscoProfitByCategory | null;
  showKioscoProfitByCategory: boolean;
  fetchKioscoProfitByCategory: () => void;
  setShowKioscoProfitByCategory: (show: boolean) => void;
  period: string;
}

const ProfitDashboard: React.FC<ProfitDashboardProps> = ({
  totalProfit,
  totalKioscoProfit,
  totalPfProfit,
  kioscoProfitByCategory,
  showKioscoProfitByCategory,
  fetchKioscoProfitByCategory,
  setShowKioscoProfitByCategory,
  period,
}) => {
  if (!showKioscoProfitByCategory && totalProfit === 0) return null;

  return (
    <div className="mt-4">
      <div className="mb-4">
        <h5 className="text-muted mb-3">
          {period === "range" ? "Desglose del Rango Seleccionado" : "Desglose del Período"}
        </h5>
        <div className="row g-3">
          <div className="col-md-4">
            <div
              className="card border-info shadow-sm h-100"
              onClick={() => {
                if (period === "range") {
                  fetchKioscoProfitByCategory();
                  setShowKioscoProfitByCategory(!showKioscoProfitByCategory);
                }
              }}
              style={{ cursor: period === "range" ? "pointer" : "default" }}>
              <div className="card-body py-3">
                <h6 className="card-subtitle mb-1 text-info">Kiosco</h6>
                <h4 className="mb-0">
                  ${totalKioscoProfit.toLocaleString("es-AR")}
                </h4>
                {period === "range" && <small className="text-muted">Click para ver categorías</small>}
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-danger shadow-sm h-100">
              <div className="card-body py-3">
                <h6 className="card-subtitle mb-1 text-danger">Pago Fácil</h6>
                <h4 className="mb-0">
                  ${totalPfProfit.toLocaleString("es-AR")}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-warning shadow-sm h-100">
              <div className="card-body py-3">
                <h6 className="card-subtitle mb-1 text-warning">Total</h6>
                <h4 className="mb-0">
                  ${totalProfit.toLocaleString("es-AR")}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showKioscoProfitByCategory && kioscoProfitByCategory && (
        <div className="animate__animated animate__fadeIn">
          <h5 className="text-muted mb-3">Ganancias Kiosco por Categoría</h5>
          <div className="row g-2">
            {[
              { label: "Factura B", val: kioscoProfitByCategory.facturaB },
              { label: "Remitos", val: kioscoProfitByCategory.remitos },
              { label: "Cyber", val: kioscoProfitByCategory.cyber },
              { label: "Cargas Virtuales", val: kioscoProfitByCategory.cargasVirtuales },
            ].map((cat, i) => (
              <div key={i} className="col-md-3">
                <div className="card bg-light border-0 shadow-sm">
                  <div className="card-body py-2 px-3">
                    <h6 className="small mb-1 text-secondary">{cat.label}</h6>
                    <h5 className="mb-0">${cat.val.toLocaleString("es-AR")}</h5>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfitDashboard;
