export type ProductDimensions = {
  widthCm: number;
  heightCm: number;
  depthCm: number;
};

/**
 * Medidas comerciales temporales asociadas por ProductoId.
 * Deben reemplazarse por datos provistos por la API cuando el modelo Producto
 * incorpore ancho, alto y profundidad.
 */
const productDimensions: Partial<Record<number, ProductDimensions>> = {
  22: { widthCm: 160, heightCm: 55, depthCm: 40 },
  23: { widthCm: 160, heightCm: 55, depthCm: 40 },
  24: { widthCm: 80, heightCm: 40, depthCm: 50 },
  25: { widthCm: 80, heightCm: 40, depthCm: 50 },
  26: { widthCm: 140, heightCm: 75, depthCm: 80 },
  27: { widthCm: 140, heightCm: 75, depthCm: 80 },
  28: { widthCm: 140, heightCm: 75, depthCm: 80 },
  29: { widthCm: 120, heightCm: 80, depthCm: 40 },
  30: { widthCm: 120, heightCm: 80, depthCm: 40 },
  31: { widthCm: 45, heightCm: 60, depthCm: 35 },
  32: { widthCm: 45, heightCm: 60, depthCm: 35 },
  33: { widthCm: 80, heightCm: 75, depthCm: 40 },
  34: { widthCm: 80, heightCm: 75, depthCm: 40 },
  35: { widthCm: 120, heightCm: 75, depthCm: 55 },
  36: { widthCm: 120, heightCm: 75, depthCm: 55 },
  37: { widthCm: 50, heightCm: 180, depthCm: 30 },
  38: { widthCm: 50, heightCm: 180, depthCm: 30 },
  40: { widthCm: 160, heightCm: 55, depthCm: 40 },
  51: { widthCm: 45, heightCm: 60, depthCm: 35 },
  52: { widthCm: 140, heightCm: 75, depthCm: 80 },
  53: { widthCm: 120, heightCm: 75, depthCm: 55 },
  54: { widthCm: 80, heightCm: 40, depthCm: 50 },
  56: { widthCm: 50, heightCm: 180, depthCm: 30 },
};

export function getProductDimensions(
  productId: number,
): ProductDimensions | undefined {
  return productDimensions[productId];
}
