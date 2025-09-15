import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCierrePfForm } from "../../hooks/useCierrePfForm";
import BoletasEspecialesModal from "./BoletasEspecialesModal";

const CierrePf = () => {
  const { id } = useParams<{ id: string }>();
  const [showBoletasModal, setShowBoletasModal] = useState(false);
  const {
    items,
    descFacturas,
    totalGanancia,
    recargasSubtotal,
    recargasSubtotalEditable,
    setRecargasSubtotal,
    setRecargasSubtotalEditable,
    setRecargas,
    setCantidadTotalBoletas,
    setWesternUnionQuantity,
    westernUnionValue,
    setWesternUnionValue,
    westernUnionValueEditable,
    setWesternUnionValueEditable,
    handleUpdateWesternUnionValue,
    valorFacturaNormal,
    setValorFacturaNormal,
    valorFacturaNormalEditable,
    setValorFacturaNormalEditable,
    handleUpdateValorFacturaNormal,
    handleSubmit,
    handleBoletaChange,
    toggleBoletaEdit,
    refetchBoletas,
  } = useCierrePfForm(id);

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
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.label}</td>
                <td>
                  <input
                    type="number"
                    className="form-control form-control-sm text-end"
                    style={{ maxWidth: "100px" }}
                    value={item.quantity}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (item.type === "total-facturas") {
                        setCantidadTotalBoletas(value);
                      } else if (item.type === "recargas") {
                        setRecargas(value);
                      } else if (item.type === "western-union") {
                        setWesternUnionQuantity(value);
                      } else {
                        handleBoletaChange(item.id, "quantity", value);
                      }
                    }}
                    onFocus={(e) => e.target.select()}
                  />
                </td>
                <td>
                  {item.type === "western-union" ? (
                    <div
                      className="input-group input-group-sm"
                      style={{ maxWidth: "120px" }}>
                      <input
                        type="number"
                        className="form-control text-end"
                        value={westernUnionValue}
                        readOnly={!westernUnionValueEditable}
                        onChange={(e) =>
                          setWesternUnionValue(Number(e.target.value))
                        }
                        onFocus={(e) => e.target.select()}
                      />
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        type="button"
                        onClick={() => {
                          if (westernUnionValueEditable) {
                            handleUpdateWesternUnionValue();
                          } else {
                            setWesternUnionValueEditable(true);
                          }
                        }}>
                        {westernUnionValueEditable ? (
                          <i className="bi bi-floppy"></i>
                        ) : (
                          <i className="bi bi-pencil-square"></i>
                        )}
                      </button>
                    </div>
                  ) : item.type === "especial" ? (
                    <div
                      className="input-group input-group-sm"
                      style={{ maxWidth: "120px" }}>
                      <input
                        type="number"
                        className="form-control text-end"
                        value={item.value}
                        readOnly={!item.editable}
                        onChange={(e) =>
                          handleBoletaChange(
                            item.id,
                            "value",
                            Number(e.target.value)
                          )
                        }
                        onFocus={(e) => e.target.select()}
                      />
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        type="button"
                        onClick={() => toggleBoletaEdit(item.id)}>
                        {item.editable ? (
                          <i className="bi bi-floppy"></i>
                        ) : (
                          <i className="bi bi-pencil-square"></i>
                        )}
                      </button>
                    </div>
                  ) : item.type === "total-facturas" ? (
                    <div
                      className="input-group input-group-sm"
                      style={{ maxWidth: "120px" }}>
                      <input
                        type="number"
                        className="form-control text-end"
                        value={valorFacturaNormal}
                        readOnly={!valorFacturaNormalEditable}
                        onChange={(e) =>
                          setValorFacturaNormal(Number(e.target.value))
                        }
                        onFocus={(e) => e.target.select()}
                      />
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        type="button"
                        onClick={() => {
                          if (valorFacturaNormalEditable) {
                            handleUpdateValorFacturaNormal();
                          } else {
                            setValorFacturaNormalEditable(true);
                          }
                        }}>
                        {valorFacturaNormalEditable ? (
                          <i className="bi bi-floppy"></i>
                        ) : (
                          <i className="bi bi-pencil-square"></i>
                        )}
                      </button>
                    </div>
                  ) : item.type === "recargas" ? (
                    <div
                      className="input-group input-group-sm"
                      style={{ maxWidth: "120px" }}>
                      <input
                        type="number"
                        className="form-control text-end"
                        value={recargasSubtotal}
                        readOnly={!recargasSubtotalEditable}
                        onChange={(e) =>
                          setRecargasSubtotal(Number(e.target.value))
                        }
                        onFocus={(e) => e.target.select()}
                      />
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        type="button"
                        onClick={() =>
                          setRecargasSubtotalEditable(!recargasSubtotalEditable)
                        }>
                        {recargasSubtotalEditable ? (
                          <i className="bi bi-floppy"></i>
                        ) : (
                          <i className="bi bi-pencil-square"></i>
                        )}
                      </button>
                    </div>
                  ) : null}
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control form-control-sm text-end"
                    readOnly
                    value={item.subtotal}
                    style={{ maxWidth: "120px" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
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
          refetchBoletas();
        }}
      />
    </div>
  );
};

export default CierrePf;
