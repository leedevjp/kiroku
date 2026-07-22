export const blockKeys = {
  // Root blocks (parentBlockId === null) of a workspace.
  roots: (workspaceId: number) => ["blocks", "roots", workspaceId] as const,
  // Direct children of a block - fetched lazily when a tree node expands.
  children: (blockId: number) => ["blocks", blockId, "children"] as const,
  detail: (id: number) => ["blocks", id] as const,
};
