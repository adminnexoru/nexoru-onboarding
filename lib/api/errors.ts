export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_ERROR";

export type ApiErrorShape = {
  code: ApiErrorCode;
  message: string;
  details?: unknown;
};

export class ApiRouteError extends Error {
  public readonly code: ApiErrorCode;
  public readonly status: number;
  public readonly details?: unknown;

  constructor(
    code: ApiErrorCode,
    message: string,
    status = 500,
    details?: unknown
  ) {
    super(message);
    this.name = "ApiRouteError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export function isApiRouteError(error: unknown): error is ApiRouteError {
  return error instanceof ApiRouteError;
}