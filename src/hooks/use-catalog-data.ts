import { useQuery } from '@tanstack/react-query';

import { adaptCatalogProducts } from '@/adapters/catalog-product-adapter';
import { getPublicCatalog } from '@/services/product-service';

export const catalogQueryKey = ['catalog', 'products'] as const;

export function useCatalogData() {
  return useQuery({
    queryKey: catalogQueryKey,
    queryFn: async () => {
      const apiProducts = await getPublicCatalog();
      const products = adaptCatalogProducts(apiProducts);

      return {
        products,
        categories: Array.from(
          new Set(products.map((product) => product.category)),
        ),
      };
    },
  });
}
