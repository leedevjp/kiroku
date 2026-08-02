import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as authApi from "./api";
import type { LoginRequest } from "./types";

export function useLoginMutation() {
  return useMutation({
    mutationFn: (request: LoginRequest) => authApi.login(request),
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authApi.logout(),
    // Cached workspace/block data belongs to the signed-out user.
    onSuccess: () => queryClient.clear(),
  });
}
