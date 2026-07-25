import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import * as blockApi from "./api";
import { blockKeys } from "./queryKeys";
import type { BlockResponse, CreateBlockRequest, MoveBlockRequest, UpdateBlockPropsRequest } from "./types";

const WRITE_MUTATION_KEY = ["blocks", "write"];

export function useRootBlocksQuery(workspaceId: number) {
  return useQuery({
    queryKey: blockKeys.roots(workspaceId),
    queryFn: () => blockApi.getRootBlocks(workspaceId),
  });
}

export function useChildBlocksQuery(
  blockId: number,
  options?: Pick<UseQueryOptions<BlockResponse[]>, "enabled">,
) {
  return useQuery({
    queryKey: blockKeys.children(blockId),
    queryFn: () => blockApi.getChildren(blockId),
    enabled: options?.enabled,
  });
}

export function useBlockQuery(id: number, options?: Pick<UseQueryOptions<BlockResponse>, "enabled">) {
  return useQuery({
    queryKey: blockKeys.detail(id),
    queryFn: () => blockApi.getBlock(id),
    enabled: options?.enabled,
  });
}

function siblingsKey(block: Pick<BlockResponse, "workspaceId" | "parentBlockId">) {
  return block.parentBlockId == null
    ? blockKeys.roots(block.workspaceId)
    : blockKeys.children(block.parentBlockId);
}

export function useCreateBlockMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: WRITE_MUTATION_KEY,
    mutationFn: (request: CreateBlockRequest) => blockApi.createBlock(request),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: siblingsKey(created) });
    },
  });
}

export function useUpdateBlockPropsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: WRITE_MUTATION_KEY,
    mutationFn: ({ id, request }: { id: number; request: UpdateBlockPropsRequest }) =>
      blockApi.updateBlockProps(id, request),
    onSuccess: (updated) => {
      queryClient.setQueryData(blockKeys.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: siblingsKey(updated) });
    },
  });
}

export function useMoveBlockMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: WRITE_MUTATION_KEY,
    mutationFn: ({ id, request }: { id: number; request: MoveBlockRequest }) =>
      blockApi.moveBlock(id, request),
    onMutate: ({ id }) => ({
      previous: queryClient.getQueryData<BlockResponse>(blockKeys.detail(id)),
    }),
    onSuccess: (moved, _variables, context) => {
      queryClient.invalidateQueries({ queryKey: siblingsKey(moved) });
      if (context?.previous && context.previous.parentBlockId !== moved.parentBlockId) {
        queryClient.invalidateQueries({ queryKey: siblingsKey(context.previous) });
      }
    },
  });
}

export function useTrashBlockMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: WRITE_MUTATION_KEY,
    mutationFn: (id: number) => blockApi.trashBlock(id),
    onSuccess: (trashed) => {
      queryClient.invalidateQueries({ queryKey: siblingsKey(trashed) });
    },
  });
}
