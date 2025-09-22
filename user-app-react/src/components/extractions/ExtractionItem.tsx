import React from "react";
import {
  Button,
  Form,
  InputGroup,
  ListGroup,
  Badge,
} from "react-bootstrap";
import { IExtraction } from "../../services/extractionService";
import { formatCurrency } from "../../utils/formatters";
import { format } from "date-fns";
import CurrencyInput from "react-currency-input-field";

interface ExtractionItemProps {
  extraction: IExtraction;
  onUpdate: (id: string, updates: any) => void;
  onStartEdit: (extraction: IExtraction) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onEditFormChange: (name: string, value: string) => void;
  editingId: string | null;
  editingData: any;
}

const getStatusVariant = (status: string) => {
  if (status === "Disponible") return "success";
  if (status === "Avisado") return "info";
  if (status === "Completado") return "secondary";
  return "primary";
};

const getBackgroundClass = (status: string) => {
  if (status === "Disponible") return "bg-success-subtle";
  if (status === "Avisado") return "bg-info-subtle";
  if (status === "Completado") return "bg-light";
  return "";
};

export const ExtractionItem = ({ 
  extraction: e,
  onUpdate,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onEditFormChange,
  editingId,
  editingData,
}: ExtractionItemProps) => {
  return (
    <ListGroup.Item
      key={e._id}
      className={`d-flex justify-content-between align-items-center ${getBackgroundClass(
        e.status
      )}`}>
      <div className="d-flex align-items-center flex-grow-1">
        {editingId !== e._id && e.status === "Pendiente" && (
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => onStartEdit(e)}
            className="me-3">
            <i className="bi bi-pencil"></i>
          </Button>
        )}

        <div className="flex-grow-1">
          {editingId === e._id ? (
            <>
              <InputGroup className="gap-2 mb-2">
                <CurrencyInput
                  name="amount"
                  value={editingData.amount}
                  onValueChange={(value) => onEditFormChange("amount", value || "")}
                  className="form-control"
                  prefix="$ "
                  groupSeparator="."
                  decimalSeparator=","
                  decimalsLimit={2}
                  onFocus={(e) => e.target.select()}
                />
                <Form.Control
                  name="clientNumber"
                  value={editingData.clientNumber}
                  onChange={(e) =>
                    onEditFormChange(e.target.name, e.target.value)
                  }
                />
                <div className="d-flex gap-2 mt-2">
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={onSaveEdit}
                    style={{ minWidth: "90px" }}>
                    <i className="bi bi-check-lg"></i> Guardar
                  </Button>

                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={onCancelEdit}
                    style={{ minWidth: "90px" }}>
                    <i className="bi bi-x-lg"></i> Cancelar
                  </Button>
                </div>
              </InputGroup>

              <div className="d-flex gap-3">
                <Form.Check
                  type="radio"
                  id={`wu-${e._id}`}
                  label="Western Union"
                  name="type"
                  value="Western Union"
                  checked={editingData.type === "Western Union"}
                  onChange={(e) =>
                    onEditFormChange(e.target.name, e.target.value)
                  }
                />
                <Form.Check
                  type="radio"
                  id={`mp-${e._id}`}
                  label="Débito/MP"
                  name="type"
                  value="Debit/MP"
                  checked={editingData.type === "Debit/MP"}
                  onChange={(e) =>
                    onEditFormChange(e.target.name, e.target.value)
                  }
                />
              </div>
            </>
          ) : (
            <>
              <span
                className={
                  e.status === "Completado"
                    ? "text-muted text-decoration-line-through"
                    : "fw-medium"
                }>
                {`${formatCurrency(e.amount)} - N°: ${e.clientNumber}`}
              </span>
              <br />
              <small className="text-muted">
                {e.createdBy?.name} -{" "}
                {format(new Date(e.createdAt), "HH:mm")}hs
                <Badge
                  pill
                  bg={e.type === "Western Union" ? "warning" : "info"}
                  className="ms-2">
                  {e.type}
                </Badge>
                <Badge
                  pill
                  bg={getStatusVariant(e.status)}
                  className="ms-2 text-capitalize">
                  {e.status}
                </Badge>
              </small>
            </>
          )}
        </div>
      </div>

      <div>
        {editingId !== e._id && (
          <>
            {e.status === "Pendiente" && (
              <Button
                variant="outline-success"
                size="sm"
                onClick={() =>
                  onUpdate(e._id, { status: "Disponible" })
                }>
                <i className="bi bi-check-lg"></i> Disponible
              </Button>
            )}
            {e.status === "Disponible" && (
              <Button
                variant="outline-info"
                size="sm"
                onClick={() => onUpdate(e._id, { status: "Avisado" })}>
                <i className="bi bi-bell"></i> Avisado
              </Button>
            )}
            {e.status === "Avisado" && (
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() =>
                  onUpdate(e._id, { status: "Completado" })
                }>
                <i className="bi bi-check-all"></i> Completado
              </Button>
            )}
            {e.status === "Completado" && (
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => onUpdate(e._id, { isArchived: true })}>
                <i className="bi bi-archive"></i> Archivar
              </Button>
            )}
          </>
        )}
      </div>
    </ListGroup.Item>
  );
}
