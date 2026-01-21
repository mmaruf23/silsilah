import type { ContentfulStatusCode, StatusCode } from 'hono/utils/http-status';

export interface SuccessResponse<T = unknown> {
  success: true;
  code: ContentfulStatusCode;
  data?: T;
  meta?: unknown;
}

interface ErrorResponse<T = unknown> {
  success: false;
  code: StatusCode;
  message: string;
  errors?: T;
}

export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;
