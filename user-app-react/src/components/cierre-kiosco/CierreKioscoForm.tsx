import { useParams } from "react-router-dom";
import { useCierreKioscoForm } from "../../hooks/useCierreKioscoForm";
import { useState } from "react";

export const CierreKioscoForm = () => {
  const { id } = useParams<{ id?: string }>();
  const {
    formData,
    totalCaja,
    totalCigarros,
    isDiscountEnabled,
    discountPercentage,
    discountAmount,
    setIsDiscountEnabled,
    setDiscountPercentage,
    handleSubmit,
    handleChange,
    handleCigarrosChange,
  } = useCierreKioscoForm(id);

  const [debo, setDebo] = useState(0);
  const [saldo, setSaldo] = useState(0);
  const [sobre, setSobre] = useState(0);

  const renderMoneyInput = (
    id: string,
    name: string,
    value: number | string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  ) => (
    <div className="input-group">
      <span className="input-group-text">$</span>
      <input
        id={id}
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="form-control"
        onFocus={(e) => e.target.select()}
        required
      />
    </div>
  );

  const renderMoneyInputSinRequired = (
    id: string,
    name: string,
    value: number | string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  ) => (
    <div className="input-group">
      <span className="input-group-text">$</span>
      <input
        id={id}
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="form-control"
        onFocus={(e) => e.target.select()}
      />
    </div>
  );

  const switchStyle = {
    backgroundColor: isDiscountEnabled ? '#0d6efd' : '#212529',
    borderColor: isDiscountEnabled ? '#0d6efd' : '#212529',
  };

  return (
    <div className="container py-1">
      <h2 className="mb-2">
        {id ? "✏️ Editar Cierre Kiosco" : "📝 Cierre Kiosco"}
      </h2>

      <form onSubmit={handleSubmit} className="row g-4">
        {/* Columna izquierda */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Ingresos</h5>
            </div>
            <div className="card-body">
              <div className="mb-2">
                <label htmlFor="fac1" className="form-label">
                  Ganancia Factura B
                </label>
                {renderMoneyInput("fac1", "fac1", formData.fac1, handleChange)}
              </div>
              <div className="mb-2">
                <label htmlFor="fac2" className="form-label">
                  Ganancia Remitos
                </label>
                {renderMoneyInput("fac2", "fac2", formData.fac2, handleChange)}
              </div>
              <div className="mb-2">
                <label htmlFor="cyber" className="form-label">
                  Cyber
                </label>
                {renderMoneyInput(
                  "cyber",
                  "cyber",
                  formData.cyber,
                  handleChange
                )}
              </div>
              <div className="mb-2">
                <label htmlFor="cargVirt" className="form-label">
                  Cargas Virtuales
                </label>
                {renderMoneyInput(
                  "cargVirt",
                  "cargVirt",
                  formData.cargVirt,
                  handleChange
                )}
              </div>

              {/* Discount Section */}
              <hr />
              <div className="row align-items-center">
                <div className="col-auto">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="discountSwitch"
                      checked={isDiscountEnabled}
                      onChange={(e) => setIsDiscountEnabled(e.target.checked)}
                      style={switchStyle}
                    />
                    <label className="form-check-label" htmlFor="discountSwitch">
                      Descontar % de ganancia
                    </label>
                  </div>
                </div>
                {isDiscountEnabled && (
                  <div className="col">
                    <div className="input-group">
                      <input
                        id="discountPercentage"
                        type="text"
                        value={discountPercentage}
                        onChange={(e) =>
                          setDiscountPercentage(Number(e.target.value))
                        }
                        className="form-control form-control-sm"
                        onFocus={(e) => e.target.select()}
                      />
                      <span className="input-group-text">%</span>
                    </div>
                    <div className="form-text mt-1">
                      Desc: ${discountAmount.toFixed(2)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-secondary text-white">
              <h5 className="mb-0">Cigarrillos</h5>
            </div>
            <div className="card-body">
              {/* Factura B */}
              <h6 className="fw-bold">Factura B</h6>
              <div className="row g-3 mb-3">
                <div className="col">
                  <label className="form-label">Total Venta</label>
                  {renderMoneyInput(
                    "cigarros-facturaB-totalVenta",
                    "cigarros-facturaB-totalVenta",
                    formData.cigarros.facturaB.totalVenta,
                    (e) =>
                      handleCigarrosChange(
                        "facturaB",
                        "totalVenta",
                        Number(e.target.value)
                      )
                  )}
                </div>
                <div className="col">
                  <label className="form-label">Ganancia</label>
                  {renderMoneyInput(
                    "cigarros-facturaB-ganancia",
                    "cigarros-facturaB-ganancia",
                    formData.cigarros.facturaB.ganancia,
                    (e) =>
                      handleCigarrosChange(
                        "facturaB",
                        "ganancia",
                        Number(e.target.value)
                      )
                  )}
                </div>
              </div>

              {/* Remito */}
              <h6 className="fw-bold">Remito</h6>
              <div className="row g-3">
                <div className="col">
                  <label className="form-label">Total Venta</label>
                  {renderMoneyInput(
                    "cigarros-remito-totalVenta",
                    "cigarros-remito-totalVenta",
                    formData.cigarros.remito.totalVenta,
                    (e) =>
                      handleCigarrosChange(
                        "remito",
                        "totalVenta",
                        Number(e.target.value)
                      )
                  )}
                </div>
                <div className="col">
                  <label className="form-label">Ganancia</label>
                  {renderMoneyInput(
                    "cigarros-remito-ganancia",
                    "cigarros-remito-ganancia",
                    formData.cigarros.remito.ganancia,
                    (e) =>
                      handleCigarrosChange(
                        "remito",
                        "ganancia",
                        Number(e.target.value)
                      )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Totales */}
        <div className="col-12">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="card text-bg-info shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-0">
                    💰 Total Caja: ${totalCaja}
                  </h5>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card text-bg-warning shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-0">
                    🚬 Total Cigarros (Costo): ${totalCigarros}
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Debo, Saldo, Sobre */}
        <h2 className="mb-0">
          Telerecargas
        </h2>
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <label htmlFor="debo" className="form-label">
                    Debo
                  </label>
                  {renderMoneyInputSinRequired("debo", "debo", debo, (e) =>
                    setDebo(Number(e.target.value))
                  )}
                </div>
                <div className="col-md-4">
                  <label htmlFor="saldo" className="form-label">
                    Saldo
                  </label>
                  {renderMoneyInputSinRequired("saldo", "saldo", saldo, (e) =>
                    setSaldo(Number(e.target.value))
                  )}
                </div>
                <div className="col-md-4">
                  <label htmlFor="sobre" className="form-label">
                    Sobre
                  </label>
                  {renderMoneyInputSinRequired("sobre", "sobre", sobre, (e) =>
                    setSobre(Number(e.target.value))
                  )}
                </div>
              </div>
              <div className="mt-3">
                <h5>
                  Poner: ${debo - saldo - sobre}
                </h5>
              </div>
            </div>
          </div>
        </div>

        {/* Botón guardar */}
        <div className="col-12 text-end">
          <button type="submit" className="btn btn-primary px-4 mt-3">
            {id ? "Actualizar" : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
};
