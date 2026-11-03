import { apiGet } from '@/services/api-client';
import type {
  ApiCatalogProduct,
  ApiCatalogProductDetail,
} from '@/types/teka-api';

export function getPublicCatalog(): Promise<ApiCatalogProduct[]> {
  return apiGet<ApiCatalogProduct[]>('/api/ecommerce/catalogo/publico');
}

export function getPublicProductDetail(
  productId: number,
): Promise<ApiCatalogProductDetail> {
  return apiGet<ApiCatalogProductDetail>(
    `/api/ecommerce/catalogo/publico/${productId}`,
  );
}
