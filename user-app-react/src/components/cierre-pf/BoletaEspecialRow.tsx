import React from "react";
import { formatCurrency } from "../../utils/formatters";
import { UseFormRegister } from "react-hook-form";
import { CierrePfInput } from "../../schemas/cierrePfSchema";

interface BoletaEspecialRowProps {
  index: number;
  register: UseFormRegister<CierrePfInput>;
  watchedBoleta: any;
  handleEnterKey: (e: React.KeyboardEvent) => void;
}

export const BoletaEspecialRow = ({
  index,
  register,
  watchedBoleta,
  handleEnterKey,
}: BoletaEspecialRowProps) => {
  const subtotal = (Number(watchedBoleta?.quantity) || 0) * (Number(watchedBoleta?.value) || 0);

  return (
    <tr>
      <td>{watchedBoleta?.name}</td>
      <td className="text-center">
        <input
          type="text"
          className="form-control form-control-sm text-center cantidad-input"
          style={{ maxWidth: "80px", margin: "0 auto" }}
          {...register(`boletasEspeciales.${index}.quantity`, { valueAsNumber: true })}
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
            className="form-control text-center bg-light"
            value={watchedBoleta?.value || 0}
            readOnly
          />
        </div>
      </td>
      <td className="text-end">
        {formatCurrency(subtotal)}
      </td>
    </tr>
  );
};
