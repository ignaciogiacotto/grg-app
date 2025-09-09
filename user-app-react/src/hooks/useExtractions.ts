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
  const [extractions, setExtractions] = useState<IExtraction[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchExtractions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getExtractions();
      setExtractions(data);
    } catch (error) {
      Swal.fire("Error", "Could not fetch extractions.", "error");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchExtractions();
  }, [fetchExtractions]);

  const handleCreate = async (
    description: string,
    type: "Western Union" | "Debit/MP"
  ) => {
    if (description.trim() === "") {
      Swal.fire("Attention", "Description cannot be empty.", "warning");
      return;
    }
    try {
      const newExtraction = await createExtraction({ description, type });
      setExtractions((prev) => [newExtraction, ...prev]);
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
      const updated = await updateExtraction(id, updates);
      if (updated.isArchived) {
        setExtractions((prev) => prev.filter((e) => e._id !== id));
      } else {
        setExtractions((prev) => prev.map((e) => (e._id === id ? updated : e)));
      }
    } catch (error) {
      Swal.fire("Error", "Could not update extraction.", "error");
    }
  };

  const handleArchiveAll = async () => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This will archive all completed extractions.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, archive them!",
        cancelButtonText: "No, cancel",
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
    extractions,
    loading,
    fetchExtractions,
    handleCreate,
    handleUpdate,
    handleArchiveAll,
  };
};
