import { IBoletaFormItem } from "../../hooks/useCierrePfForm";

interface WesternUnionRowProps {
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

export const WesternUnionRow = ({
  item,
  state,
  dispatch,
  handleUpdatePersistentValue,
}: WesternUnionRowProps) => {
  const { westernUnionValue, westernUnionValueEditable, westernUnionValueId } =
    state;

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
                field: "westernUnionQuantity",
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
            value={westernUnionValue}
            readOnly={!westernUnionValueEditable}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                payload: {
                  field: "westernUnionValue",
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
              if (westernUnionValueEditable) {
                handleUpdatePersistentValue(
                  westernUnionValueId,
                  "Western Union Value",
                  westernUnionValue,
                  "westernUnionValueEditable"
                );
              } else {
                dispatch({
                  type: "SET_FIELD",
                  payload: { field: "westernUnionValueEditable", value: true },
                });
              }
            }}>
            {westernUnionValueEditable ? (
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
