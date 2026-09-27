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
  isNew?: boolean;
};

export const categories = [
  'Todos',
  'Living',
  'Dormitorio',
  'Escritorio',
  'Comedor',
  'Guardado',
  'Otros',
];
export const products: Product[] = [
  { id: 1, name: 'Mesa ratona', category: 'Living', price: '$ 549.000', image: require('../../assets/images/teka/Teka (17).png'), isNew: true },
  { id: 2, name: 'Mesa de Luz', category: 'Dormitorio', price: '$ 268.000', image: require('../../assets/images/teka/Teka (22).png') },
  { id: 3, name: 'Rack de TV', category: 'Living', price: '$ 785.000', image: require('../../assets/images/teka/Teka (27).png') },
  { id: 4, name: 'Biblioteca', category: 'Comedor', price: '$ 629.000', image: require('../../assets/images/teka/Teka (31).png'), isNew: true },
];
