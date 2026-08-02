import { apiClient } from "@/lib/api-client";
import type {
  ChangePasswordRequest,
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse,
} from "./types";

export async function createUser(request: CreateUserRequest): Promise<UserResponse> {
  const { data } = await apiClient.post<UserResponse>("/users", request);
  return data;
}

export async function getMe(): Promise<UserResponse> {
  const { data } = await apiClient.get<UserResponse>("/users/me");
  return data;
}

export async function updateUser(id: number, request: UpdateUserRequest): Promise<UserResponse> {
  const { data } = await apiClient.patch<UserResponse>(`/users/${id}`, request);
  return data;
}

export async function changePassword(id: number, request: ChangePasswordRequest): Promise<void> {
  await apiClient.patch(`/users/${id}/password`, request);
}

export async function deleteUser(id: number): Promise<void> {
  await apiClient.delete(`/users/${id}`);
}
