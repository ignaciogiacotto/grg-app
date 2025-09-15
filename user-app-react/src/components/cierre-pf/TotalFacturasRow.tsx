import { IBoletaFormItem } from "../../hooks/useCierrePfForm";

interface TotalFacturasRowProps {
  item: IBoletaFormItem;
  state: any;
  dispatch: React.Dispatch<any>;
  handleUpdatePersistentValue: (
    valueId: string | null,
    name: string,
    value: number,
    field: any
  ) => void;
}

export const TotalFacturasRow = ({
  item,
  state,
  dispatch,
  handleUpdatePersistentValue,
}: TotalFacturasRowProps) => {
  const {
    valorFacturaNormal,
    valorFacturaNormalEditable,
    valorFacturaNormalId,
  } = state;

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
              payload: {
                field: "cantidadTotalBoletas",
                value: Number(e.target.value),
              },
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
            value={valorFacturaNormal}
            readOnly={!valorFacturaNormalEditable}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                payload: {
                  field: "valorFacturaNormal",
                  value: Number(e.target.value),
                },
              })
            }
            onFocus={(e) => e.target.select()}
          />
          <button
            className="btn btn-outline-secondary btn-sm"
            type="button"
            onClick={() => {
              if (valorFacturaNormalEditable) {
                handleUpdatePersistentValue(
                  valorFacturaNormalId,
                  "Valor Factura Normal",
                  valorFacturaNormal,
                  "valorFacturaNormalEditable"
                );
              } else {
                dispatch({
                  type: "SET_FIELD",
                  payload: { field: "valorFacturaNormalEditable", value: true },
                });
              }
            }}>
            {valorFacturaNormalEditable ? (
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
