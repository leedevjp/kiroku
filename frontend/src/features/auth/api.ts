import { apiClient } from "@/lib/api-client";
import type { LoginRequest } from "./types";

// The backend sets / clears the JWT as an HttpOnly cookie, so neither call
// returns a body - success is all the caller needs to know.
export async function login(request: LoginRequest): Promise<void> {
  await apiClient.post("/auth/login", request);
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout");
}
