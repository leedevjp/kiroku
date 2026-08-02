import { apiClient } from "@/lib/api-client";
import type { CreateWorkspaceRequest, UpdateWorkspaceRequest, WorkspaceResponse } from "./types";

export async function getWorkspace(id: number): Promise<WorkspaceResponse> {
  const { data } = await apiClient.get<WorkspaceResponse>(`/workspaces/${id}`);
  return data;
}

export async function getWorkspaces(): Promise<WorkspaceResponse[]> {
  const { data } = await apiClient.get<WorkspaceResponse[]>("/workspaces");
  return data;
}

export async function createWorkspace(request: CreateWorkspaceRequest): Promise<WorkspaceResponse> {
  const { data } = await apiClient.post<WorkspaceResponse>("/workspaces", request);
  return data;
}

export async function updateWorkspace(
  id: number,
  request: UpdateWorkspaceRequest,
): Promise<WorkspaceResponse> {
  const { data } = await apiClient.patch<WorkspaceResponse>(`/workspaces/${id}`, request);
  return data;
}

export async function deleteWorkspace(id: number): Promise<void> {
  await apiClient.delete(`/workspaces/${id}`);
}
