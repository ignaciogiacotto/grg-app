import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useCierrePfForm, IBoletaFormItem } from "../../hooks/useCierrePfForm";
import { formatCurrency } from "../../utils/formatters";
import BoletasEspecialesModal from "./BoletasEspecialesModal";
import { BoletaEspecialRow } from "./BoletaEspecialRow";
import { WesternUnionRow } from "./WesternUnionRow";
import { TotalFacturasRow } from "./TotalFacturasRow";
import { RecargasRow } from "./RecargasRow";

const CierrePf = () => {
  const { id } = useParams<{ id: string }>();
  const [showBoletasModal, setShowBoletasModal] = useState(false);
  const { state, dispatch, items, handleSubmit, handleUpdatePersistentValue } =
    useCierrePfForm(id);
  const { descFacturas, totalGanancia } = state;

  const renderRow = (item: IBoletaFormItem) => {
    const key = `${item.type}-${item.id}`;
    switch (item.type) {
      case "western-union":
        return (
          <WesternUnionRow
            item={item}
            state={state}
            dispatch={dispatch}
            handleUpdatePersistentValue={handleUpdatePersistentValue}
          />
        );
      case "total-facturas":
        return (
          <TotalFacturasRow
            item={item}
            state={state}
            dispatch={dispatch}
            handleUpdatePersistentValue={handleUpdatePersistentValue}
          />
        );
      case "recargas":
        return (
          <RecargasRow
            key={`${item.type}-${item.id}`}
            item={item}
            state={state}
            dispatch={dispatch}
          />
        );
      case "especial":
        return <BoletaEspecialRow key={key} item={item} dispatch={dispatch} />;
      default:
        return null;
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="container mt-1">
      <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between mb-3">
        <div>
          <h2 className="mb-1 fw-bold">
            {id ? "✏️ Editar Cierre PF" : "📝 Cierre PF"}
          </h2>
          <p className="text-muted small mb-0">
            Registrá el cierre diario de Pago Fácil y controlá la ganancia.
          </p>
        </div>
        <div className="d-flex flex-wrap gap-2 align-items-end">
          <div>
            <label htmlFor="date" className="form-label mb-1">
              Fecha del cierre
            </label>
            <input
              id="date"
              type="date"
              name="date"
              value={state.date}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  payload: { field: "date", value: e.target.value },
                })
              }
              max={today}
              className="form-control form-control-sm"
              required
            />
          </div>
          <button
            type="button"
            className="btn btn-outline-secondary ms-md-2 mt-2 mt-md-0"
            onClick={() => setShowBoletasModal(true)}>
            <i className="bi bi-receipt-cutoff me-1" />
            Gestionar Boletas
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card shadow-sm mb-3">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-sm table-striped table-hover align-middle mb-0 cierrepf-table">
                <thead className="table-light">
                  <tr>
                    <th>Item</th>
                    <th>Cantidad</th>
                    <th>Valor</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <React.Fragment key={item.id}>
                      {renderRow(item)}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="d-flex flex-wrap gap-3 mt-1 align-items-center justify-content-between">
          <div className="d-flex gap-3 flex-wrap">
            <div className="card border-0 shadow-sm bg-info bg-opacity-75">
              <div className="card-body py-2 px-3">
                <div className="text-dark small mb-1 fw-semibold">
                  Boletas especiales
                </div>
                <div className="d-flex align-items-baseline">
                  <span className="fs-3 fw-bold mb-0 me-2">{descFacturas}</span>
                  <span className="badge bg-light text-dark border">
                    cantidad
                  </span>
                </div>
              </div>
            </div>
            <div className="card border-0 shadow-sm bg-success bg-opacity-75">
              <div className="card-body py-2 px-3">
                <div className="text-white small mb-1 fw-semibold">
                  Total ganancia
                </div>
                <div className="fs-3 fw-bold mb-0 text-dark">
                  {formatCurrency(totalGanancia)}
                </div>
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-lg">
            <i className="bi bi-save me-2"></i>
            {id ? "Actualizar" : "Guardar"}
          </button>
        </div>
      </form>

      <BoletasEspecialesModal
        show={showBoletasModal}
        onHide={() => {
          setShowBoletasModal(false);
          dispatch({ type: "REFETCH_BOLETAS" });
        }}
      />
    </div>
  );
};

export default CierrePf;
