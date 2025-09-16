import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCierrePfForm, IBoletaFormItem } from "../../hooks/useCierrePfForm";
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
        return <RecargasRow item={item} state={state} dispatch={dispatch} />;
      case "especial":
        return <BoletaEspecialRow key={key} item={item} dispatch={dispatch} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mt-1">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0 text-center fw-bold">
          {id ? "✏️ Editar Cierre PF" : "📝 Cierre PF"}
        </h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowBoletasModal(true)}>
          Gestionar Boletas
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <table className="table table-sm table-striped table-hover cierrepf-table align-middle">
          <thead className="table-light">
            <tr>
              <th>Item</th>
              <th>Cantidad</th>
              <th>Valor</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>{items.map(renderRow)}</tbody>
        </table>

        <div className="d-flex flex-wrap gap-2 mt-1 align-items-center justify-content-between">
          <div className="d-flex gap-3 flex-wrap">
            <div className="card p-3 shadow-sm bg-light">
              <span className="fw-bold">Cant. Boletas Especiales:</span>{" "}
              {descFacturas}
            </div>
            <div className="card p-3 shadow-sm bg-info text-white">
              <span className="fw-bold">Total Ganancia:</span> {totalGanancia}
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

