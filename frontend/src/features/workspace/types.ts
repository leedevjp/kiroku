export interface CreateWorkspaceRequest {
  name: string;
}

export interface UpdateWorkspaceRequest {
  name: string;
}

export interface WorkspaceResponse {
  id: number;
  name: string;
}
