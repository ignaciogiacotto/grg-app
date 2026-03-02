import { Card, Form } from "react-bootstrap";
import { formatCurrency } from "../../../utils/formatters";

interface MarkupCardProps {
  value: number;
  setter: (value: number) => void;
  price: number;
  isEditing: boolean;
}

export const MarkupCard = ({ value, setter, price, isEditing }: MarkupCardProps) => {
  return (
    <Card bg="secondary" className="border-0 shadow-sm overflow-hidden h-100">
      <div className="d-flex align-items-stretch" style={{ minHeight: "45px" }}>
        {/* Lado del Porcentaje (Configuración) */}
        <div className="bg-white d-flex align-items-center px-3" style={{ minWidth: "100px" }}>
          <Form.Control
            type="number"
            value={value}
            onChange={(e) => setter(Number(e.target.value))}
            readOnly={!isEditing}
            className={`p-0 border-0 bg-transparent text-dark fw-bold ${!isEditing ? "pe-none" : "border-bottom border-dark"}`}
            style={{
              width: "60px",
              fontSize: "1rem",
              textAlign: "center",
              outline: "none",
              boxShadow: "none",
            }}
          />
          <span className="ms-1 small text-dark opacity-75 fw-bold">%</span>
        </div>

        {/* Lado del Precio (Resultado) */}
        <div className="flex-grow-1 d-flex align-items-center justify-content-end px-3 py-2">
          <span className="fw-bold text-white" style={{ fontSize: "1.2rem" }}>
            {formatCurrency(price)}
          </span>
        </div>
      </div>
    </Card>
  );
};
