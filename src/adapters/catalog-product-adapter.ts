import type { Product } from '@/types/catalog';
import { resolveApiAssetUrl } from '@/services/api-client';
import type {
  ApiCatalogImage,
  ApiCatalogProduct,
  ApiCatalogProductDetail,
} from '@/types/teka-api';

function formatPrice(price: number): string {
  return `$ ${Math.round(price).toLocaleString('es-AR')}`;
}

export function adaptCatalogProducts(
  apiProducts: ApiCatalogProduct[],
): Product[] {
  return apiProducts.map((apiProduct) => ({
    id: apiProduct.productoId,
    code: apiProduct.codigo,
    name: apiProduct.nombre,
    description: apiProduct.descripcionComercial,
    category: apiProduct.tipoProductoNombre,
    color: apiProduct.colorNombre,
    price: formatPrice(apiProduct.precio),
    priceValue: apiProduct.precio,
    image: { uri: resolveApiAssetUrl(apiProduct.urlPortada) },
    dimensions: {
      widthCm: apiProduct.anchoCm,
      heightCm: apiProduct.altoCm,
      depthCm: apiProduct.profundidadCm,
    },
    availableQuantity: Math.max(0, Math.floor(apiProduct.disponibleOnline)),
    isFeatured: apiProduct.destacado,
  }));
}

function adaptImages(images: ApiCatalogImage[]) {
  return [...images]
    .sort((left, right) => left.ordenVisual - right.ordenVisual)
    .map((image) => ({ uri: resolveApiAssetUrl(image.urlArchivo) }));
}

export function adaptCatalogProductDetail(
  detail: ApiCatalogProductDetail,
): Product {
  const product = adaptCatalogProducts([detail.producto])[0];
  const images = adaptImages(detail.imagenes);

  return {
    ...product,
    image: images[0] ?? product.image,
    images,
  };
}
