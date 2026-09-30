import type { ImageSourcePropType } from 'react-native';

const productImages: Partial<Record<number, ImageSourcePropType>> = {
  22: require('../../assets/images/teka/Teka (27).png'),
  24: require('../../assets/images/teka/Teka (17).png'),
  31: require('../../assets/images/teka/Teka (22).png'),
  37: require('../../assets/images/teka/Teka (31).png'),
};

export function getProductImage(
  productId: number,
): ImageSourcePropType | undefined {
  return productImages[productId];
}