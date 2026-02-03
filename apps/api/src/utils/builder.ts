import type { Meta } from '@/types/response.type';

export const metaBuilder = (
  total: number,
  page: number = 1,
  per_page: number = 10,
): Meta => ({
  total_items: total,
  current_page: page,
  per_page: per_page,
  total_pages: Math.ceil(total / per_page),
});
