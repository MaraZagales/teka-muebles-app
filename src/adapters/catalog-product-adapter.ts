import { getProductImage } from '@/data/product-images';
import type { Product } from '@/data/products';
import type {
  ApiProduct,
  ApiSalePrice,
} from '@/types/teka-api';

function formatPrice(price: number): string {
  return `$ ${Math.round(price).toLocaleString('es-AR')}`;
}

export function adaptCatalogProducts(
  apiProducts: ApiProduct[],
  apiPrices: ApiSalePrice[],
): Product[] {
  const pricesByProductId = new Map(
    apiPrices.map((price) => [
      price.productoId,
      price.precio,
    ]),
  );

  return apiProducts.map((apiProduct) => {
    const price = pricesByProductId.get(apiProduct.productoId);

    return {
      id: apiProduct.productoId,
      code: apiProduct.codigo,
      name: apiProduct.nombre,
      description: apiProduct.descripcion,
      category: apiProduct.tipoProductoNombre,
      color: apiProduct.colorNombre,
      price: price === undefined
        ? 'Consultar precio'
        : formatPrice(price),
      priceValue: price ?? null,
      image: getProductImage(apiProduct.productoId),
    };
  });
}