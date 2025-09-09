import { useParams } from "react-router-dom";
import { useCierrePfForm } from "../../hooks/useCierrePfForm";

interface ICierrePf {
  western: number;
  mp: number;
  liga: number;
  santander: number;
  giros: number;
  uala: number;
  naranjaX: number;
  nsaAgencia: number;
  brubank: number;
  direcTv: number;
  extracciones: number;
  recargas: number;
  cantTotalFacturas: number;
}

const CierrePf = () => {
  const { id } = useParams<{ id: string }>();
  const {
    formData,
    editableValores,
    descFacturas,
    totalGanancia,
    recargasSubtotal,
    recargasSubtotalEditable,
    setRecargasSubtotal,
    setRecargasSubtotalEditable,
    handleSubmit,
    handleQuantityChange,
    handleValueChange,
    toggleEdit,
    items,
  } = useCierrePfForm(id);

  return (
    <div className="container mt-1">
      <h2 className="mb-1 text-center fw-bold">
        {id ? "✏️ Editar Cierre PF" : "📝 Cierre PF"}
      </h2>
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
                    id={`quantity-${item.id}`}
                    name={`quantity-${item.id}`}
                    aria-label={`${item.label} Quantity`}
                    type="text"
                    className="form-control form-control-sm text-end"
                    style={{ maxWidth: "100px" }}
                    value={formData[item.stateKey as keyof ICierrePf]}
                    onChange={(e) =>
                      handleQuantityChange(
                        item.stateKey as keyof ICierrePf,
                        Number(e.target.value)
                      )
                    }
                    onFocus={(e) => e.target.select()}
                  />
                </td>
                <td>
                  {item.type === "both" && (
                    <div
                      className="input-group input-group-sm"
                      style={{ maxWidth: "120px" }}>
                      <input
                        id={`value-${item.id}`}
                        name={`value-${item.id}`}
                        aria-label={`${item.label} Value`}
                        type="text"
                        className="form-control text-end"
                        value={editableValores[item.stateKey]?.value || 0}
                        onChange={(e) =>
                          handleValueChange(
                            item.stateKey,
                            Number(e.target.value)
                          )
                        }
                        readOnly={!editableValores[item.stateKey]?.editable}
                        onFocus={(e) => e.target.select()}
                      />
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        type="button"
                        onClick={() => toggleEdit(item.stateKey)}>
                        {editableValores[item.stateKey]?.editable ? (
                          <i className="bi bi-floppy"></i>
                        ) : (
                          <i className="bi bi-pencil-square"></i>
                        )}
                      </button>
                    </div>
                  )}
                  {item.type === "recargas" && (
                    <div
                      className="input-group input-group-sm"
                      style={{ maxWidth: "120px" }}>
                      <input
                        id="recargas-subtotal"
                        name="recargas-subtotal"
                        aria-label="Recargas Subtotal"
                        type="text"
                        className="form-control text-end"
                        value={recargasSubtotal}
                        onChange={(e) =>
                          setRecargasSubtotal(Number(e.target.value))
                        }
                        readOnly={!recargasSubtotalEditable}
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
                  )}
                </td>
                <td>
                  <input
                    aria-label={`${item.label} Subtotal`}
                    type="text"
                    className="form-control form-control-sm text-end"
                    readOnly
                    value={
                      item.type === "simple"
                        ? formData[item.stateKey as keyof ICierrePf]
                        : item.stateKey === "cantTotalFacturas"
                        ? Math.max(
                            0,
                            formData.cantTotalFacturas - descFacturas
                          ) * (editableValores.cantTotalFacturas?.value || 0)
                        : item.type === "recargas"
                        ? recargasSubtotal
                        : formData[item.stateKey as keyof ICierrePf] *
                          (editableValores[item.stateKey]?.value || 0)
                    }
                    style={{ maxWidth: "120px" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totales + Botón en la misma línea (responsive) */}
        <div className="d-flex flex-wrap gap-2 mt-1 align-items-center justify-content-between">
          <div className="d-flex gap-3 flex-wrap">
            <div className="card p-3 shadow-sm bg-light">
              <span className="fw-bold">Desc. Facturas:</span> {descFacturas}
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
    </div>
  );
};

export default CierrePf;
