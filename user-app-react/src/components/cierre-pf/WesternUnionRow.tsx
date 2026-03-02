import React, { useState } from "react";
import { formatCurrency } from "../../utils/formatters";
import { UseFormRegister } from "react-hook-form";
import { CierrePfInput } from "../../schemas/cierrePfSchema";

interface WesternUnionRowProps {
  register: UseFormRegister<CierrePfInput>;
  value: number;
  subtotal: number;
  handleUpdatePersistentValue: (name: string, value: number) => Promise<void>;
  handleEnterKey: (e: React.KeyboardEvent) => void;
}

export const WesternUnionRow = ({
  register,
  value: initialValue,
  subtotal,
  handleUpdatePersistentValue,
  handleEnterKey,
}: WesternUnionRowProps) => {
  const [isEditable, setIsEditable] = useState(false);
  const [currentValue, setCurrentValue] = useState(initialValue);

  return (
    <tr>
      <td className="fw-semibold text-primary">Western Union</td>
      <td className="text-center">
        <input
          type="text"
          className="form-control form-control-sm text-center cantidad-input"
          style={{ maxWidth: "80px", margin: "0 auto" }}
          {...register("westernUnionQuantity", { valueAsNumber: true })}
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
            value={isEditable ? currentValue : initialValue}
            readOnly={!isEditable}
            onChange={(e) => setCurrentValue(Number(e.target.value))}
            onFocus={(e) => e.target.select()}
          />
          <button
            className={`btn ${isEditable ? "btn-success" : "btn-outline-secondary"}`}
            type="button"
            onClick={async () => {
              if (isEditable) {
                await handleUpdatePersistentValue("Western Union Value", currentValue);
                setIsEditable(false);
              } else {
                setCurrentValue(initialValue);
                setIsEditable(true);
              }
            }}>
            {isEditable ? <i className="bi bi-floppy"></i> : <i className="bi bi-pencil"></i>}
          </button>
        </div>
      </td>
      <td className="text-end">
        {formatCurrency(subtotal)}
      </td>
    </tr>
  );
};
