import { NextResponse } from "next/server";
import { ApiErrorCode, ApiErrorShape, ApiRouteError } from "@/lib/api/errors";

export type ApiSuccessResponse<T> = {
  ok: true;
  data: T;
};

export type ApiErrorResponse = {
  ok: false;
  error: ApiErrorShape;
};

export function apiOk<T>(data: T, status = 200) {
  return NextResponse.json<ApiSuccessResponse<T>>(
    {
      ok: true,
      data,
    },
    { status }
  );
}

export function apiError(
  code: ApiErrorCode,
  message: string,
  status: number,
  details?: unknown
) {
  return NextResponse.json<ApiErrorResponse>(
    {
      ok: false,
      error: {
        code,
        message,
        details,
      },
    },
    { status }
  );
}

export function apiErrorFromUnknown(error: unknown) {
  if (error instanceof ApiRouteError) {
    return apiError(error.code, error.message, error.status, error.details);
  }

  console.error("UNHANDLED_API_ERROR:", error);

  return apiError(
    "INTERNAL_ERROR",
    "Internal server error",
    500
  );
}