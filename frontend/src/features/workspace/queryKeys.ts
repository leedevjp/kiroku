export const workspaceKeys = {
  all: ["workspaces"] as const,
  detail: (id: number) => ["workspaces", id] as const,
};
