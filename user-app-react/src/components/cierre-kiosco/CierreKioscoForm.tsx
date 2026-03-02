import { useParams } from "react-router-dom";
import { useCierreKioscoForm } from "../../hooks/cierre-kiosco/useCierreKioscoForm";
import { useState, type FocusEvent, type MouseEvent } from "react";

export const CierreKioscoForm = () => {
  const { id } = useParams<{ id?: string }>();
  const {
    register,
    handleSubmit,
    errors,
    totalCaja,
    totalCigarros,
    isDiscountEnabled,
    discountPercentage,
    discountAmount,
    setIsDiscountEnabled,
    setDiscountPercentage,
    loading,
  } = useCierreKioscoForm(id);

  // Estados locales para cálculos informativos (no se guardan en el backend)
  const [debo, setDebo] = useState(0);
  const [saldo, setSaldo] = useState(0);
  const [sobre, setSobre] = useState(0);

  const today = new Date().toISOString().split("T")[0];

  const handleFocusSelectAll = (event: FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  const handleClickSelectAll = (event: MouseEvent<HTMLInputElement>) => {
    event.currentTarget.select();
  };

  if (loading) {
    return <div className="container mt-4 text-center">Cargando...</div>;
  }

  return (
    <div className="container py-1">
      <form onSubmit={handleSubmit}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h2>{id ? "✏️ Editar Cierre Kiosco" : "📝 Cierre Kiosco"}</h2>
          <div className="col-md-3">
            <label htmlFor="date" className="form-label mb-0 me-2">
              Fecha del cierre:
            </label>
            <input
              id="date"
              type="date"
              {...register("date")}
              max={today}
              onFocus={handleFocusSelectAll}
              onClick={handleClickSelectAll}
              className={`form-control ${errors.date ? "is-invalid" : ""}`}
            />
          </div>
        </div>

        <div className="row g-4">
          {/* Columna izquierda: Ingresos */}
          <div className="col-md-6">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Ingresos</h5>
              </div>
              <div className="card-body bg-primary-subtle">
                <div className="mb-2">
                  <label htmlFor="fac1" className="form-label">
                    Ganancia Factura B
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="text"
                      step="0.01"
                      className={`form-control ${errors.fac1 ? "is-invalid" : ""}`}
                      onFocus={handleFocusSelectAll}
                      onClick={handleClickSelectAll}
                      {...register("fac1", { valueAsNumber: true })}
                    />
                  </div>
                </div>

                <div className="mb-2">
                  <label htmlFor="fac2" className="form-label">
                    Ganancia Remitos
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="text"
                      step="0.01"
                      className={`form-control ${errors.fac2 ? "is-invalid" : ""}`}
                      onFocus={handleFocusSelectAll}
                      onClick={handleClickSelectAll}
                      {...register("fac2", { valueAsNumber: true })}
                    />
                  </div>
                </div>

                <div className="mb-2">
                  <label htmlFor="cyber" className="form-label">
                    Cyber
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="text"
                      step="0.01"
                      className={`form-control ${errors.cyber ? "is-invalid" : ""}`}
                      onFocus={handleFocusSelectAll}
                      onClick={handleClickSelectAll}
                      {...register("cyber", { valueAsNumber: true })}
                    />
                  </div>
                </div>

                <div className="mb-2">
                  <label htmlFor="cargVirt" className="form-label">
                    Cargas Virtuales
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="text"
                      step="0.01"
                      className={`form-control ${errors.cargVirt ? "is-invalid" : ""}`}
                      onFocus={handleFocusSelectAll}
                      onClick={handleClickSelectAll}
                      {...register("cargVirt", { valueAsNumber: true })}
                    />
                  </div>
                </div>

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
                      />
                      <label
                        className="form-check-label"
                        htmlFor="discountSwitch">
                        Descontar % de ganancia
                      </label>
                    </div>
                  </div>
                  {isDiscountEnabled && (
                    <div className="col">
                      <div className="input-group">
                        <input
                          type="text"
                          value={discountPercentage}
                          onChange={(e) =>
                            setDiscountPercentage(Number(e.target.value))
                          }
                          onFocus={handleFocusSelectAll}
                          onClick={handleClickSelectAll}
                          className="form-control form-control-sm"
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

          {/* Columna derecha: Cigarrillos */}
          <div className="col-md-6">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-secondary text-white">
                <h5 className="mb-0">Cigarrillos</h5>
              </div>
              <div className="card-body bg-secondary-subtle">
                <h6 className="fw-bold">Factura B</h6>
                <div className="row g-3 mb-3">
                  <div className="col">
                    <label className="form-label">Total Venta</label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        type="text"
                        step="0.01"
                        className="form-control"
                        onFocus={handleFocusSelectAll}
                        onClick={handleClickSelectAll}
                        {...register("cigarros.facturaB.totalVenta", {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <label className="form-label">Ganancia</label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        type="text"
                        step="0.01"
                        className="form-control"
                        onFocus={handleFocusSelectAll}
                        onClick={handleClickSelectAll}
                        {...register("cigarros.facturaB.ganancia", {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                  </div>
                </div>

                <h6 className="fw-bold">Remito</h6>
                <div className="row g-3">
                  <div className="col">
                    <label className="form-label">Total Venta</label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        type="text"
                        step="0.01"
                        className="form-control"
                        onFocus={handleFocusSelectAll}
                        onClick={handleClickSelectAll}
                        {...register("cigarros.remito.totalVenta", {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <label className="form-label">Ganancia</label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        type="text"
                        step="0.01"
                        className="form-control"
                        onFocus={handleFocusSelectAll}
                        onClick={handleClickSelectAll}
                        {...register("cigarros.remito.ganancia", {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
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
                  <div className="card-body text-center">
                    <h5 className="card-title mb-0">
                      💰 Total Caja: ${totalCaja.toFixed(2)}
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card text-bg-warning shadow-sm">
                  <div className="card-body text-center">
                    <h5 className="card-title mb-0">
                      🚬 Total Cigarros (Costo): ${totalCigarros.toFixed(2)}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Telerecargas */}
          <div className="col-12">
            <h2 className="mb-2">Telerecargas</h2>
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Debo</label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        type="text"
                        className="form-control"
                        value={debo}
                        onChange={(e) => setDebo(Number(e.target.value))}
                        onFocus={handleFocusSelectAll}
                        onClick={handleClickSelectAll}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Saldo</label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        type="text"
                        className="form-control"
                        value={saldo}
                        onChange={(e) => setSaldo(Number(e.target.value))}
                        onFocus={handleFocusSelectAll}
                        onClick={handleClickSelectAll}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Sobre</label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        type="text"
                        className="form-control"
                        value={sobre}
                        onChange={(e) => setSobre(Number(e.target.value))}
                        onFocus={handleFocusSelectAll}
                        onClick={handleClickSelectAll}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <h5>Poner: ${(debo - saldo - sobre).toFixed(2)}</h5>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 text-end">
            <button type="submit" className="btn btn-primary px-5 py-2">
              {id ? "Actualizar Cierre" : "Guardar Cierre"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
