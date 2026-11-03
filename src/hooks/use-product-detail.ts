import { useQuery } from '@tanstack/react-query';

import { adaptCatalogProductDetail } from '@/adapters/catalog-product-adapter';
import { getPublicProductDetail } from '@/services/product-service';

export function useProductDetail(productId: number | null) {
  return useQuery({
    queryKey: ['product-detail', productId],
    enabled: productId !== null,
    queryFn: async () => {
      if (productId === null) {
        throw new Error('El producto solicitado no es válido.');
      }

      const detail = await getPublicProductDetail(productId);
      const product = adaptCatalogProductDetail(detail);

      return {
        product,
        availableStock: product.availableQuantity,
      };
    },
  });
}
