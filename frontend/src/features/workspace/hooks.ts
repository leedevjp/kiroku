import { useQuery } from "@tanstack/react-query";
import * as workspaceApi from "./api";
import { workspaceKeys } from "./queryKeys";

export function useWorkspaceQuery(id: number) {
  return useQuery({
    queryKey: workspaceKeys.detail(id),
    queryFn: () => workspaceApi.getWorkspace(id),
  });
}
