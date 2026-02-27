import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as extractionService from '../services/extractionService';
import { IExtraction, ExtractionStatus } from '../services/extractionService';
import Swal from 'sweetalert2';

export const useExtractionsQuery = () => {
  return useQuery<IExtraction[]>({
    queryKey: ['extractions'],
    queryFn: extractionService.getExtractions,
  });
};

export const useCreateExtractionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      amount: number;
      clientNumber: string;
      type: "Western Union" | "Debit/MP";
    }) => extractionService.createExtraction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['extractions'] });
    },
    onError: () => {
      Swal.fire("Error", "No se pudo crear la extracción.", "error");
    }
  });
};

export const useUpdateExtractionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: {
      id: string;
      updates: {
        status?: ExtractionStatus;
        isArchived?: boolean;
        description?: string;
        type?: "Western Union" | "Debit/MP";
      }
    }) => extractionService.updateExtraction(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['extractions'] });
    },
    onError: () => {
      Swal.fire("Error", "No se pudo actualizar la extracción.", "error");
    }
  });
};

export const useArchiveAllCompletedMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: extractionService.archiveAllCompleted,
    onSuccess: (response) => {
      Swal.fire("Archivado!", response.message, "success");
      queryClient.invalidateQueries({ queryKey: ['extractions'] });
    },
    onError: () => {
      Swal.fire("Error", "No se pudieron archivar las extracciones.", "error");
    }
  });
};
