import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as workspaceApi from "./api";
import { workspaceKeys } from "./queryKeys";
import type { CreateWorkspaceRequest, UpdateWorkspaceRequest } from "./types";

export function useWorkspaceQuery(id: number) {
  return useQuery({
    queryKey: workspaceKeys.detail(id),
    queryFn: () => workspaceApi.getWorkspace(id),
  });
}

export function useWorkspacesQuery() {
  return useQuery({
    queryKey: workspaceKeys.list(),
    queryFn: () => workspaceApi.getWorkspaces(),
    retry: false,
  });
}

export function useCreateWorkspaceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateWorkspaceRequest) => workspaceApi.createWorkspace(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.list() });
    },
  });
}

export function useUpdateWorkspaceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateWorkspaceRequest }) =>
      workspaceApi.updateWorkspace(id, request),
    onSuccess: (updated) => {
      queryClient.setQueryData(workspaceKeys.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: workspaceKeys.list() });
    },
  });
}

export function useDeleteWorkspaceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => workspaceApi.deleteWorkspace(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.list() });
    },
  });
}
