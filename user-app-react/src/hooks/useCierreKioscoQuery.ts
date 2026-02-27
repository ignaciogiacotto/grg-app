import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as cierreKioscoService from '../services/cierreKioscoService';

export interface ICierreKiosco {
  _id?: string;
  date?: string;
  fac1: number;
  fac2: number;
  cyber: number;
  cargVirt: number;
  cigarros: {
    facturaB: { totalVenta: number; ganancia: number; costo?: number };
    remito: { totalVenta: number; ganancia: number; costo?: number };
  };
  totalCaja: number;
  totalCigarros: number;
  createdBy?: string;
}

export const useCierresKioscoQuery = () => {
  return useQuery<ICierreKiosco[]>({
    queryKey: ['cierresKiosco'],
    queryFn: cierreKioscoService.getCierresKiosco,
  });
};

export const useCierreKioscoQuery = (id: string | undefined) => {
  return useQuery<ICierreKiosco>({
    queryKey: ['cierreKiosco', id],
    queryFn: () => cierreKioscoService.getCierreKioscoById(id!),
    enabled: !!id,
  });
};

export const useCreateCierreKioscoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cierreKioscoService.createCierreKiosco,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cierresKiosco'] });
      queryClient.invalidateQueries({ queryKey: ['dailyProfitReport'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummaryStats'] });
    },
  });
};

export const useUpdateCierreKioscoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, cierre }: { id: string; cierre: ICierreKiosco }) =>
      cierreKioscoService.updateCierreKiosco(id, cierre),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cierresKiosco'] });
      queryClient.invalidateQueries({ queryKey: ['cierreKiosco', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dailyProfitReport'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummaryStats'] });
    },
  });
};

export const useDeleteCierreKioscoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cierreKioscoService.deleteCierreKiosco(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cierresKiosco'] });
      queryClient.invalidateQueries({ queryKey: ['dailyProfitReport'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummaryStats'] });
      Swal.fire("¡Borrado!", "El registro ha sido borrado.", "success");
    },
    onError: () => {
      Swal.fire("Error", "Ocurrió un error al borrar el registro.", "error");
    }
  });
};
