import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as userApi from "./api";
import { userKeys } from "./queryKeys";
import type { ChangePasswordRequest, CreateUserRequest, UpdateUserRequest } from "./types";

export function useCreateUserMutation() {
  return useMutation({
    mutationFn: (request: CreateUserRequest) => userApi.createUser(request),
  });
}

export function useMeQuery() {
  return useQuery({
    queryKey: userKeys.me,
    queryFn: () => userApi.getMe(),
    retry: false,
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateUserRequest }) =>
      userApi.updateUser(id, request),
    onSuccess: (updated) => {
      queryClient.setQueryData(userKeys.me, updated);
    },
  });
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: ChangePasswordRequest }) =>
      userApi.changePassword(id, request),
  });
}

export function useDeleteUserMutation() {
  return useMutation({
    mutationFn: (id: number) => userApi.deleteUser(id),
  });
}
