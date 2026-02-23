import { IBoletaFormItem } from "../../hooks/useCierrePfForm";
import React from "react";
import { formatCurrency } from "../../utils/formatters";

interface BoletaEspecialRowProps {
  item: IBoletaFormItem;
  dispatch: React.Dispatch<any>;
}

export const BoletaEspecialRow = ({
  item,
  dispatch,
}: BoletaEspecialRowProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const inputs = Array.from(
        document.querySelectorAll(".cantidad-input")
      ) as HTMLInputElement[];

      const currentIndex = inputs.findIndex((input) => input === e.currentTarget);

      if (currentIndex !== -1 && currentIndex < inputs.length - 1) {
        inputs[currentIndex + 1].focus();
      }
    }
  };

  return (
    <tr key={item.id}>
      <td>{item.label}</td>
      <td>
        <input
          type="text"
          className="form-control form-control-sm text-end cantidad-input"
          style={{ maxWidth: "100px" }}
          value={item.quantity}
          onChange={(e) =>
            dispatch({
              type: "UPDATE_BOLETA",
              payload: {
                id: item.id,
                field: "quantity",
                value: parseInt(e.target.value) || 0,
              },
            })
          }
          onFocus={(e) => e.target.select()}
          onKeyDown={handleKeyDown}
        />
      </td>
      <td>
        <div className="input-group input-group-sm" style={{ maxWidth: "120px" }}>
          <input
            type="text"
            className="form-control text-end"
            value={item.value as number}
            readOnly={!item.editable}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_BOLETA",
                payload: {
                  id: item.id,
                  field: "value",
                  value: parseInt(e.target.value) || 0,
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
          type="text"
          className="form-control form-control-sm text-end"
          readOnly
          value={formatCurrency(Number(item.subtotal) || 0)}
          style={{ maxWidth: "120px" }}
        />
      </td>
    </tr>
  );
};