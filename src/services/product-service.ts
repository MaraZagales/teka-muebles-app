import { apiGet } from '@/services/api-client';
import type {
  ApiProduct,
  ApiProductStock,
  ApiSalePrice,
} from '@/types/teka-api';

export function getProducts(): Promise<ApiProduct[]> {
  return apiGet<ApiProduct[]>('/api/productos');
}

export function getProductById(productId: number): Promise<ApiProduct> {
  return apiGet<ApiProduct>(`/api/productos/${productId}`);
}

export function getSalePrices(): Promise<ApiSalePrice[]> {
  return apiGet<ApiSalePrice[]>('/api/precios-venta');
}

export function getCurrentSalePrice(
  productId: number,
): Promise<ApiSalePrice> {
  return apiGet<ApiSalePrice>(
    `/api/precios-venta/producto/${productId}/vigente`,
  );
}

export function getProductStock(
  productId: number,
): Promise<ApiProductStock[]> {
  return apiGet<ApiProductStock[]>(
    `/api/stock/productos/por-producto/${productId}`,
  );
}
