import { IBoletaFormItem } from "../../hooks/useCierrePfForm";

interface BoletaEspecialRowProps {
  item: IBoletaFormItem;
  dispatch: React.Dispatch<any>;
}

export const BoletaEspecialRow = ({
  item,
  dispatch,
}: BoletaEspecialRowProps) => (
  <tr key={item.id}>
    <td>{item.label}</td>
    <td>
      <input
        type="number"
        className="form-control form-control-sm text-end"
        style={{ maxWidth: "100px" }}
        value={item.quantity}
        onChange={(e) =>
          dispatch({
            type: "UPDATE_BOLETA",
            payload: {
              id: item.id,
              field: "quantity",
              value: Number(e.target.value),
            },
          })
        }
        onFocus={(e) => e.target.select()}
      />
    </td>
    <td>
      <div className="input-group input-group-sm" style={{ maxWidth: "120px" }}>
        <input
          type="number"
          className="form-control text-end"
          value={item.value as number}
          readOnly={!item.editable}
          onChange={(e) =>
            dispatch({
              type: "UPDATE_BOLETA",
              payload: {
                id: item.id,
                field: "value",
                value: Number(e.target.value),
              },
            })
          }
          onFocus={(e) => e.target.select()}
        />
        <button
          className="btn btn-outline-secondary btn-sm"
          type="button"
          onClick={() =>
            dispatch({ type: "TOGGLE_BOLETA_EDIT", payload: item.id })
          }>
          {item.editable ? (
            <i className="bi bi-floppy"></i>
          ) : (
            <i className="bi bi-pencil-square"></i>
          )}
        </button>
      </div>
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
);
