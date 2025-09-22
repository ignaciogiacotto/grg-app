import React from "react";
import {
  Card,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import { IExtraction } from "../../services/extractionService";
import { ExtractionItem } from "./ExtractionItem";

import { formatCurrency } from "../../utils/formatters";

export const ExtractionColumn: React.FC<{ 
  title: string;
  extractions: IExtraction[];
  loading: boolean;
  onUpdate: (id: string, updates: any) => void;
  onStartEdit: (extraction: IExtraction) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onEditFormChange: (name: string, value: string) => void;
  editingId: string | null;
  editingData: any;
  totalAmount?: number;
}> = ({ 
  title,
  extractions,
  loading,
  totalAmount,
  ...rest
}) => {
  return (
    <Card className="shadow-sm h-100">
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">{title}</h5>
          {totalAmount && totalAmount > 0 && (
            <span className="fw-bold">Total: {formatCurrency(totalAmount)}</span>
          )}
        </div>
      </Card.Header>
      <ListGroup
        variant="flush"
        style={{ overflowY: "auto", maxHeight: "60vh" }}>
        {loading ? (
          <div className="text-center p-3">
            <Spinner animation="border" />
          </div>
        ) : extractions.length > 0 ? (
          extractions.map((e) => (
            <ExtractionItem key={e._id} extraction={e} {...rest} />
          ))
        ) : (
          <ListGroup.Item className="text-center text-muted">
            No hay solicitudes.
          </ListGroup.Item>
        )}
      </ListGroup>
    </Card>
  );
};