import type { ImageSourcePropType } from 'react-native';

const productImages: Partial<Record<number, ImageSourcePropType[]>> = {
  22: [
    require('../../assets/images/products/product-22-1.jpg'),
    require('../../assets/images/products/product-22-2.jpg'),
    require('../../assets/images/products/product-22-3.jpg'),
  ],
  23: [
    require('../../assets/images/products/product-23-1.jpg'),
    require('../../assets/images/products/product-23-2.jpg'),
    require('../../assets/images/products/product-23-3.jpg'),
  ],
  24: [
    require('../../assets/images/products/product-24-1.jpg'),
    require('../../assets/images/products/product-24-2.jpg'),
    require('../../assets/images/products/product-24-3.jpg'),
  ],
  25: [
    require('../../assets/images/products/product-25-1.jpg'),
    require('../../assets/images/products/product-25-2.jpg'),
    require('../../assets/images/products/product-25-3.jpg'),
  ],
  26: [
    require('../../assets/images/products/product-26-1.jpg'),
    require('../../assets/images/products/product-26-2.jpg'),
    require('../../assets/images/products/product-26-3.jpg'),
  ],
  27: [
    require('../../assets/images/products/product-27-1.jpg'),
    require('../../assets/images/products/product-27-2.jpg'),
    require('../../assets/images/products/product-27-3.jpg'),
  ],
  28: [
    require('../../assets/images/products/product-28-1.jpg'),
    require('../../assets/images/products/product-28-2.jpg'),
    require('../../assets/images/products/product-28-3.jpg'),
  ],
  29: [
    require('../../assets/images/products/product-29-1.jpg'),
  ],
  30: [
    require('../../assets/images/products/product-30-1.jpg'),
    require('../../assets/images/products/product-30-2.jpg'),
    require('../../assets/images/products/product-30-3.jpg'),
  ],
  31: [
    require('../../assets/images/products/product-31-1.jpg'),
    require('../../assets/images/products/product-31-2.jpg'),
    require('../../assets/images/products/product-31-3.jpg'),
  ],
  32: [
    require('../../assets/images/products/product-32-1.jpg'),
    require('../../assets/images/products/product-32-2.jpg'),
    require('../../assets/images/products/product-32-3.jpg'),
  ],
  33: [
    require('../../assets/images/products/product-33-1.jpg'),
  ],
  34: [
    require('../../assets/images/products/product-34-1.jpg'),
  ],
  35: [
    require('../../assets/images/products/product-35-1.jpg'),
  ],
  36: [
    require('../../assets/images/products/product-36-1.jpg'),
  ],
  37: [
    require('../../assets/images/products/product-37-1.jpg'),
    require('../../assets/images/products/product-37-2.jpg'),
    require('../../assets/images/products/product-37-3.jpg'),
  ],
  38: [
    require('../../assets/images/products/product-38-1.jpg'),
    require('../../assets/images/products/product-38-2.jpg'),
    require('../../assets/images/products/product-38-3.jpg'),
  ],
};

export function getProductImages(
  productId: number,
): ImageSourcePropType[] {
  return productImages[productId] ?? [];
}

export function getProductImage(
  productId: number,
): ImageSourcePropType | undefined {
  return getProductImages(productId)[0];
}
