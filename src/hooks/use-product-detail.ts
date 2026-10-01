import { useQuery } from '@tanstack/react-query';

import { adaptCatalogProducts } from '@/adapters/catalog-product-adapter';
import { ApiRequestError } from '@/services/api-client';
import {
  getCurrentSalePrice,
  getProductById,
  getProductStock,
} from '@/services/product-service';

export function useProductDetail(productId: number | null) {
  return useQuery({
    queryKey: ['product-detail', productId],
    enabled: productId !== null,
    queryFn: async () => {
      if (productId === null) {
        throw new Error('El producto solicitado no es válido.');
      }

      const [apiProduct, stock] = await Promise.all([
        getProductById(productId),
        getProductStock(productId),
      ]);

      if (!apiProduct.activo) {
        throw new Error('Este producto ya no se encuentra disponible.');
      }

      let currentPrice = null;

      try {
        currentPrice = await getCurrentSalePrice(productId);
      } catch (error) {
        if (!(error instanceof ApiRequestError) || error.status !== 404) {
          throw error;
        }
      }

      const product = adaptCatalogProducts(
        [apiProduct],
        currentPrice ? [currentPrice] : [],
      )[0];

      const availableStock = Math.max(
        0,
        Math.floor(
          stock.reduce(
            (total, item) => total + item.cantidadActual,
            0,
          ),
        ),
      );

      return {
        product,
        availableStock,
      };
    },
  });
}
