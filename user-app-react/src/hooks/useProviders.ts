import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as providerService from '../services/providerService';
import { IProvider } from '../services/providerService';

export const useProvidersQuery = () => {
  return useQuery<IProvider[]>({
    queryKey: ['providers'],
    queryFn: async () => {
      let providers = await providerService.getProviders();
      const weekDays = [
        "lunes",
        "martes",
        "miercoles",
        "jueves",
        "viernes",
        "sabado",
      ];
      
      if (providers.length === 0) {
        for (const day of weekDays) {
          await providerService.createProvider(day);
        }
        providers = await providerService.getProviders();
      }
      return providers;
    },
  });
};

export const useCreateProviderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (day: string) => providerService.createProvider(day),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
    },
  });
};

export const useUpdateProviderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ day, providers }: { day: string; providers: string[] }) =>
      providerService.updateProvider(day, providers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
    },
  });
};
