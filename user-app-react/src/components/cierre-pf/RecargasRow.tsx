import { IBoletaFormItem } from "../../hooks/useCierrePfForm";

interface RecargasRowProps {
  item: IBoletaFormItem;
  state: any;
  dispatch: React.Dispatch<any>;
}

export const RecargasRow = ({ item, state, dispatch }: RecargasRowProps) => {
  const { recargasSubtotal, recargasSubtotalEditable } = state;

  return (
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
              type: "SET_FIELD",
              payload: { field: "recargas", value: Number(e.target.value) },
            })
          }
          onFocus={(e) => e.target.select()}
        />
      </td>
      <td>
        <div
          className="input-group input-group-sm"
          style={{ maxWidth: "120px" }}>
          <input
            type="number"
            className="form-control text-end"
            value={recargasSubtotal}
            readOnly={!recargasSubtotalEditable}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                payload: {
                  field: "recargasSubtotal",
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
              dispatch({
                type: "SET_FIELD",
                payload: {
                  field: "recargasSubtotalEditable",
                  value: !recargasSubtotalEditable,
                },
              })
            }>
            {recargasSubtotalEditable ? (
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
};
