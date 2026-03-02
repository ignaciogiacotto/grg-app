import React, { useState } from "react";
import { formatCurrency } from "../../utils/formatters";
import { UseFormRegister, useWatch, Control } from "react-hook-form";
import { CierrePfInput } from "../../schemas/cierrePfSchema";

interface RecargasRowProps {
  register: UseFormRegister<CierrePfInput>;
  control: Control<CierrePfInput>;
  handleEnterKey: (e: React.KeyboardEvent) => void;
}

export const RecargasRow = ({ register, control, handleEnterKey }: RecargasRowProps) => {
  const [isEditable, setIsEditable] = useState(false);
  const subtotal = useWatch({
    control,
    name: "recargasSubtotal",
  });

  return (
    <tr>
      <td className="fw-semibold text-primary">Recargas</td>
      <td className="text-center">
        <input
          type="text"
          className="form-control form-control-sm text-center cantidad-input"
          style={{ maxWidth: "80px", margin: "0 auto" }}
          {...register("recargas", { valueAsNumber: true })}
          onFocus={(e) => e.target.select()}
          onKeyDown={handleEnterKey}
        />
      </td>
      <td className="text-center">
        <div
          className="input-group input-group-sm justify-content-center"
          style={{ maxWidth: "120px", margin: "0 auto" }}
        >
          <span className="input-group-text">$</span>
          <input
            type="text"
            className="form-control text-center"
            readOnly={!isEditable}
            {...register("recargasSubtotal", { valueAsNumber: true })}
            onFocus={(e) => e.target.select()}
          />
          <button
            className={`btn ${isEditable ? "btn-success" : "btn-outline-secondary"}`}
            type="button"
            onClick={() => setIsEditable(!isEditable)}>
            {isEditable ? <i className="bi bi-floppy"></i> : <i className="bi bi-pencil"></i>}
          </button>
        </div>
      </td>
      <td className="text-end">
        {formatCurrency(subtotal || 0)}
      </td>
    </tr>
  );
};
