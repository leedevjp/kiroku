import { apiClient } from "@/lib/api-client";
import type {
  BlockResponse,
  CreateBlockRequest,
  MoveBlockRequest,
  UpdateBlockPropsRequest,
} from "./types";

export async function getRootBlocks(workspaceId: number): Promise<BlockResponse[]> {
  const { data } = await apiClient.get<BlockResponse[]>("/blocks", { params: { workspaceId } });
  return data;
}

export async function getChildren(blockId: number): Promise<BlockResponse[]> {
  const { data } = await apiClient.get<BlockResponse[]>(`/blocks/${blockId}/children`);
  return data;
}

export async function getBlock(id: number): Promise<BlockResponse> {
  const { data } = await apiClient.get<BlockResponse>(`/blocks/${id}`);
  return data;
}

export async function createBlock(request: CreateBlockRequest): Promise<BlockResponse> {
  const { data } = await apiClient.post<BlockResponse>("/blocks", request);
  return data;
}

export async function updateBlockProps(
  id: number,
  request: UpdateBlockPropsRequest,
): Promise<BlockResponse> {
  const { data } = await apiClient.patch<BlockResponse>(`/blocks/${id}`, request);
  return data;
}

export async function moveBlock(id: number, request: MoveBlockRequest): Promise<BlockResponse> {
  const { data } = await apiClient.patch<BlockResponse>(`/blocks/${id}/move`, request);
  return data;
}

export async function trashBlock(id: number): Promise<BlockResponse> {
  const { data } = await apiClient.patch<BlockResponse>(`/blocks/${id}/trash`);
  return data;
}
