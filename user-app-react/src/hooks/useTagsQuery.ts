import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import tagService from '../services/tagService';
import { ITag } from '../types';

export const useTagsQuery = () => {
  return useQuery<ITag[]>({
    queryKey: ['tags'],
    queryFn: tagService.getTags,
  });
};

export const useCreateTagMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tag: { name: string }) => tagService.createTag(tag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};

export const useDeleteTagMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tagService.deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};
