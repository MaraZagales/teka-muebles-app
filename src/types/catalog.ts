import type { ImageSourcePropType } from 'react-native';

export type ProductDimensions = {
  widthCm: number;
  heightCm: number;
  depthCm: number;
};

export type Product = {
  id: number;
  code?: string;
  name: string;
  description?: string | null;
  category: string;
  color?: string | null;
  price: string;
  priceValue: number;
  image?: ImageSourcePropType;
  images?: ImageSourcePropType[];
  dimensions: ProductDimensions;
  availableQuantity: number;
  isFeatured: boolean;
};
