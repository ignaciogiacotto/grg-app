import { useState, useCallback, useEffect } from "react";
import {
  getExtractions,
  createExtraction,
  updateExtraction,
  archiveAllCompleted,
  IExtraction,
  ExtractionStatus,
} from "../services/extractionService";
import Swal from "sweetalert2";

export const useExtractions = () => {
  const [pendingExtractions, setPendingExtractions] = useState<IExtraction[]>([]);
  const [confirmedExtractions, setConfirmedExtractions] = useState<IExtraction[]>([]);
  const [completedExtractions, setCompletedExtractions] = useState<IExtraction[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchExtractions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getExtractions();
      setPendingExtractions(data.filter(e => e.status === 'Pendiente' || e.status === 'Disponible'));
      setConfirmedExtractions(data.filter(e => e.status === 'Avisado'));
      setCompletedExtractions(data.filter(e => e.status === 'Completado'));
    } catch (error) {
      Swal.fire("Error", "Could not fetch extractions.", "error");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchExtractions();
  }, [fetchExtractions]);

  const handleCreate = async (
    amount: string,
    clientNumber: string,
    type: "Western Union" | "Debit/MP"
  ) => {
    if (amount.trim() === "") {
      Swal.fire("Attention", "Amount cannot be empty.", "warning");
      return;
    }
    try {
      const newExtraction = await createExtraction({ amount: Number(amount), clientNumber, type });
      setPendingExtractions((prev) => [newExtraction, ...prev]);
    } catch (error) {
      Swal.fire("Error", "Could not create extraction.", "error");
    }
  };

  const handleUpdate = async (
    id: string,
    updates: {
      status?: ExtractionStatus;
      isArchived?: boolean;
      description?: string;
      type?: "Western Union" | "Debit/MP";
    }
  ) => {
    try {
      await updateExtraction(id, updates);
      fetchExtractions(); // Refetch all to ensure consistency
    } catch (error) {
      Swal.fire("Error", "Could not update extraction.", "error");
    }
  };

  const handleArchiveAll = async () => {
    try {
      const result = await Swal.fire({
        title: "Estas seguro?",
        text: "Esta accion archivara todas las solicitudes.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Si, archivarlas!",
        cancelButtonText: "No, cancelar",
      });

      if (result.isConfirmed) {
        const response = await archiveAllCompleted();
        Swal.fire("Archived!", response.message, "success");
        fetchExtractions(); // Refresh list
      }
    } catch (error) {
      Swal.fire("Error", "Could not archive extractions.", "error");
    }
  };

  return {
    pendingExtractions,
    confirmedExtractions,
    completedExtractions,
    loading,
    fetchExtractions,
    handleCreate,
    handleUpdate,
    handleArchiveAll,
  };
};
