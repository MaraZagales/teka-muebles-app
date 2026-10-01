import type { ImageSourcePropType } from 'react-native';

export type Product = {
  id: number;
  code?: string;
  name: string;
  description?: string | null;
  category: string;
  color?: string | null;
  price: string;
  priceValue?: number | null;
  image?: ImageSourcePropType;
  images?: ImageSourcePropType[];
  isNew?: boolean;
}
