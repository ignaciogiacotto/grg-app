import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import noteService from '../services/noteService';
import { INote } from '../types';

export const useNotesQuery = () => {
  return useQuery<INote[]>({
    queryKey: ['notes'],
    queryFn: noteService.getNotes,
  });
};

export const useDeleteNoteMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => noteService.deleteNote(id),
    onSuccess: () => {
      // Invalida la cache de notas para forzar un re-fetch automático
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};

export const useMarkAsReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => noteService.markAsRead(id),
    onSuccess: () => {
      // Invalida tanto las notas como el contador de no leídas
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotesCount'] });
    }
  });
};
