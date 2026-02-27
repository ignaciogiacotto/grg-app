import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import cierrePfService, { ICierrePf, IBoletaEspecialDB } from '../services/cierrePfService';
import Swal from 'sweetalert2';

export const useCierresPfQuery = () => {
  return useQuery<ICierrePf[]>({
    queryKey: ['cierresPf'],
    queryFn: cierrePfService.getCierresPf,
  });
};

export const useCierrePfQuery = (id: string | undefined) => {
  return useQuery<ICierrePf>({
    queryKey: ['cierrePf', id],
    queryFn: () => cierrePfService.getCierrePfById(id!),
    enabled: !!id,
  });
};

export const useCreateCierrePfMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cierrePfService.createCierrePf,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cierresPf'] });
      queryClient.invalidateQueries({ queryKey: ['dailyProfitReport'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummaryStats'] });
    },
  });
};

export const useUpdateCierrePfMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, cierre }: { id: string; cierre: ICierrePf }) =>
      cierrePfService.updateCierrePf(id, cierre),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cierresPf'] });
      queryClient.invalidateQueries({ queryKey: ['cierrePf', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dailyProfitReport'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummaryStats'] });
    },
  });
};

export const useDeleteCierrePfMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cierrePfService.deleteCierrePf(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cierresPf'] });
      queryClient.invalidateQueries({ queryKey: ['dailyProfitReport'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummaryStats'] });
      Swal.fire("¡Borrado!", "El registro ha sido borrado.", "success");
    },
    onError: () => {
      Swal.fire("Error", "Ocurrió un error al borrar el registro.", "error");
    }
  });
};

// Boletas Especiales Queries & Mutations
export const useBoletasEspecialesQuery = () => {
  return useQuery<IBoletaEspecialDB[]>({
    queryKey: ['boletasEspeciales'],
    queryFn: cierrePfService.getBoletasEspeciales,
  });
};

export const useCreateBoletaEspecialMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cierrePfService.createBoletaEspecial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boletasEspeciales'] });
    },
  });
};

export const useUpdateBoletaEspecialMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, boleta }: { id: string; boleta: { name: string; value: number; order?: number } }) =>
      cierrePfService.updateBoletaEspecial(id, boleta),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boletasEspeciales'] });
    },
  });
};

export const useDeleteBoletaEspecialMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cierrePfService.deleteBoletaEspecial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boletasEspeciales'] });
    },
  });
};
