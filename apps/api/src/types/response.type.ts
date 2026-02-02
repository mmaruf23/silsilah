import type { ContentfulStatusCode, StatusCode } from 'hono/utils/http-status';

export interface Meta {
  total_items: number;
  current_page: number;
  per_page: number;
  total_pages: number;
}
export interface SuccessResponse<T = unknown> {
  success: true;
  code: ContentfulStatusCode;
  data?: T;
  meta?: Meta;
}

interface ErrorResponse<T = unknown> {
  success: false;
  code: StatusCode;
  message: string;
  errors?: T;
}

export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;
