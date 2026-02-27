import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as userService from '../services/userService';
import { IUser } from '../services/userService';

export const useUsersQuery = (page: number, pageSize: number = 10) => {
  return useQuery({
    queryKey: ['users', page, pageSize],
    queryFn: () => userService.getUsers(page, pageSize),
  });
};

export const useUserQuery = (id: string | undefined) => {
  return useQuery<IUser>({
    queryKey: ['user', id],
    queryFn: () => userService.getUserById(id!),
    enabled: !!id,
  });
};

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: IUser) => userService.createUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, user }: { id: string; user: IUser }) =>
      userService.updateUser(id, user),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
    },
  });
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
