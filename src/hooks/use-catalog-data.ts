import { useQuery } from '@tanstack/react-query';

import { adaptCatalogProducts } from '@/adapters/catalog-product-adapter';
import { getProductTypes } from '@/services/auxiliary-service';
import {
    getProducts,
    getSalePrices,
} from '@/services/product-service';

export const catalogQueryKey = ['catalog', 'products'] as const;

export function useCatalogData() {
  return useQuery({
    queryKey: catalogQueryKey,

    queryFn: async () => {
      const [apiProducts, apiPrices, productTypes] = await Promise.all([
        getProducts(),
        getSalePrices(),
        getProductTypes(),
      ]);

      const activeProducts = apiProducts.filter(
        (product) => product.activo,
      );

      const activePrices = apiPrices.filter(
        (price) => price.activo,
      );

      return {
        products: adaptCatalogProducts(
          activeProducts,
          activePrices,
        ),
        productTypes,
      };
    },
  });
}