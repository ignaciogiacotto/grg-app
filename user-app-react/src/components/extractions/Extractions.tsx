import React, { useState, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
} from "react-bootstrap";
import {
  useExtractionsQuery,
  useCreateExtractionMutation,
  useUpdateExtractionMutation,
  useArchiveAllCompletedMutation,
} from "../../hooks/useExtractionsQuery";
import { IExtraction } from "../../services/extractionService";
import { QuickQuote } from "./QuickQuote";
import { NewExtractionForm } from "./NewExtractionForm";
import { ExtractionColumn } from "./ExtractionColumn";
import Swal from "sweetalert2";

const Extractions: React.FC = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<{
    amount: number;
    clientNumber: string;
    type: "Western Union" | "Debit/MP";
  }>({ amount: 0, clientNumber: "", type: "Western Union" });

  const { data: extractions = [], isLoading: loadingExtractions, refetch } = useExtractionsQuery();
  const createMutation = useCreateExtractionMutation();
  const updateMutation = useUpdateExtractionMutation();
  const archiveMutation = useArchiveAllCompletedMutation();

  const pendingExtractions = useMemo(() => 
    extractions.filter(e => e.status === 'Pendiente' || e.status === 'Disponible'),
    [extractions]
  );
  const confirmedExtractions = useMemo(() => 
    extractions.filter(e => e.status === 'Avisado'),
    [extractions]
  );
  const completedExtractions = useMemo(() => 
    extractions.filter(e => e.status === 'Completado'),
    [extractions]
  );

  const confirmedTotal = confirmedExtractions.reduce(
    (sum, extraction) => sum + extraction.amount,
    0
  );

  const handleCreate = (amount: string, clientNumber: string, type: "Western Union" | "Debit/MP") => {
    if (amount.trim() === "") {
      Swal.fire("Atención", "El monto no puede estar vacío.", "warning");
      return;
    }
    createMutation.mutate({ amount: Number(amount), clientNumber, type });
  };

  const handleUpdate = async (id: string, updates: any) => {
    updateMutation.mutate({ id, updates });
  };

  const handleArchiveAll = async () => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción archivará todas las solicitudes completadas.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, archivarlas!",
      cancelButtonText: "No, cancelar",
    });

    if (result.isConfirmed) {
      archiveMutation.mutate();
    }
  };

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
    handleUpdate(editingId, editingData);
    setEditingId(null);
  };

  const handleEditFormChange = (name: string, value: string) => {
    setEditingData((prev) => ({ ...prev, [name]: value }));
  };

  const columnProps = {
    loading: loadingExtractions || updateMutation.isPending,
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

      <NewExtractionForm handleCreate={handleCreate} loading={loadingExtractions || createMutation.isPending} />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => refetch()}
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
          disabled={loadingExtractions || archiveMutation.isPending}>
          {archiveMutation.isPending ? (
            <Spinner as="span" animation="border" size="sm" />
          ) : (
            <i className="bi bi-archive-fill me-1"></i>
          )}
          <span className="ms-1">Eliminar completadas</span>
        </Button>
      </div>

      <Row>
        <Col md={4}>
          <ExtractionColumn
            title="Pendientes"
            extractions={pendingExtractions}
            totalAmount={pendingExtractions.reduce(
              (sum, extraction) => sum + extraction.amount,
              0
            )}
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