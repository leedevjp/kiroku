import axios, { type AxiosError } from "axios";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const GENERIC_MESSAGES: Record<number, string> = {
  403: "You don't have permission to do this.",
  404: "Not found.",
};

const DEFAULT_MESSAGE = "Something went wrong. Please try again.";

function hasMessageField(data: unknown): data is { message: string } {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof (data as Record<string, unknown>).message === "string"
  );
}

// Relative baseURL so requests go through the Next.js rewrite proxy
// (see next.config.ts) instead of hitting the backend cross-origin.
export const apiClient = axios.create({
  baseURL: "/api",
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (!error.response) {
      return Promise.reject(new ApiError(0, "Network error. Please check your connection."));
    }

    const { status, data } = error.response;

    // The backend's GlobalExceptionHandler only formats 400 and 401 as
    // { message }. Everything else (403, 5xx, ...) falls through to Spring
    // Boot's default error controller, whose response shape isn't stable -
    // don't trust `data.message` there, use a generic fallback instead.
    if ((status === 400 || status === 401) && hasMessageField(data)) {
      return Promise.reject(new ApiError(status, data.message));
    }

    return Promise.reject(new ApiError(status, GENERIC_MESSAGES[status] ?? DEFAULT_MESSAGE));
  },
);
