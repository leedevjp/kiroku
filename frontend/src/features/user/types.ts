export interface CreateUserRequest {
  email: string;
  password: string;
  nickname: string | null;
}

export interface UpdateUserRequest {
  nickname: string | null;
}

export interface ChangePasswordRequest {
  password: string;
}

export interface UserResponse {
  id: number;
  email: string;
  nickname: string | null;
  createdAt: string;
  updatedAt: string;
}
