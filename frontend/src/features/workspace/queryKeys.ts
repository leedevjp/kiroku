export const workspaceKeys = {
  all: ["workspaces"] as const,
  list: () => ["workspaces", "list"] as const,
  detail: (id: number) => ["workspaces", id] as const,
};
