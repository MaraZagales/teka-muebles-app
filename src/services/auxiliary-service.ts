import { apiGet } from '@/services/api-client';
import type { ApiLookup } from '@/types/teka-api';

export function getProductTypes(): Promise<ApiLookup[]> {
  return apiGet<ApiLookup[]>('/api/Auxiliares/tipos-producto');
}