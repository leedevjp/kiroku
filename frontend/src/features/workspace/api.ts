import { apiClient } from "@/lib/api-client";
import type { WorkspaceResponse } from "./types";

export async function getWorkspace(id: number): Promise<WorkspaceResponse> {
  const { data } = await apiClient.get<WorkspaceResponse>(`/workspaces/${id}`);
  return data;
}
