import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
} from "react-bootstrap";
import { useExtractions } from "../../hooks/useExtractions";
import { IExtraction } from "../../services/extractionService";
import { QuickQuote } from "./QuickQuote";
import { NewExtractionForm } from "./NewExtractionForm";
import { ExtractionColumn } from "./ExtractionColumn";

const Extractions: React.FC = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<{
    amount: number;
    clientNumber: string;
    type: "Western Union" | "Debit/MP";
  }>({ amount: 0, clientNumber: "", type: "Western Union" });

  const {
    pendingExtractions,
    confirmedExtractions,
    completedExtractions,
    loading: loadingExtractions,
    fetchExtractions,
    handleCreate,
    handleUpdate,
    handleArchiveAll,
  } = useExtractions();

  const confirmedTotal = confirmedExtractions.reduce(
    (sum, extraction) => sum + extraction.amount,
    0
  );

  const handleStartEdit = (extraction: IExtraction) => {
    setEditingId(extraction._id);
    setEditingData({
      amount: extraction.amount,
      clientNumber: extraction.clientNumber,
      type: extraction.type,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    await handleUpdate(editingId, editingData);
    setEditingId(null);
  };

  const handleEditFormChange = (name: string, value: string) => {
    setEditingData((prev) => ({ ...prev, [name]: value }));
  };

  const columnProps = {
    loading: loadingExtractions,
    onUpdate: handleUpdate,
    onStartEdit: handleStartEdit,
    onCancelEdit: handleCancelEdit,
    onSaveEdit: handleSaveEdit,
    onEditFormChange: handleEditFormChange,
    editingId,
    editingData,
  };

  return (
    <Container className="my-4">
      <h1 className="mb-4 text-center fw-bold">
        💸 Solicitudes de extracción de dinero
      </h1>

      <QuickQuote />

      <NewExtractionForm handleCreate={handleCreate} loading={loadingExtractions} />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => fetchExtractions()}
            disabled={loadingExtractions}>
            {loadingExtractions ? (
              <Spinner as="span" animation="border" size="sm" />
            ) : (
              <i className="bi bi-arrow-clockwise"></i>
            )}
            <span className="ms-2">Refrescar</span>
          </Button>
        </div>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={handleArchiveAll}
          disabled={loadingExtractions}>
          <i className="bi bi-archive-fill me-1"></i> Eliminar completadas
        </Button>
      </div>

      <Row>
        <Col md={4}>
          <ExtractionColumn
            title="Pendientes"
            extractions={pendingExtractions}
            {...columnProps}
          />
        </Col>
        <Col md={4}>
          <ExtractionColumn
            title="Confirmadas"
            extractions={confirmedExtractions}
            totalAmount={confirmedTotal}
            {...columnProps}
          />
        </Col>
        <Col md={4}>
          <ExtractionColumn
            title="Completadas"
            extractions={completedExtractions}
            {...columnProps}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Extractions;