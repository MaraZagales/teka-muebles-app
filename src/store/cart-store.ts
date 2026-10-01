import type { ImageSourcePropType } from 'react-native';
import { create } from 'zustand';

export type CartItem = {
  productId: number;
  name: string;
  code?: string;
  price: number;
  image?: ImageSourcePropType;
  quantity: number;
  maximumQuantity: number;
};

type AddCartItem = Omit<CartItem, 'quantity'>;

type CartState = {
  items: CartItem[];
  addItem: (item: AddCartItem, quantity: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clear: () => void;
};

function clampQuantity(quantity: number, maximum: number): number {
  return Math.min(Math.max(Math.trunc(quantity), 1), maximum);
}

export const useCartStore = create<CartState>((set) => ({
  items: [],

  addItem: (item, quantity) =>
    set((state) => {
      if (item.maximumQuantity < 1 || quantity < 1) {
        return state;
      }

      const existing = state.items.find(
        (cartItem) => cartItem.productId === item.productId,
      );

      if (!existing) {
        return {
          items: [
            ...state.items,
            {
              ...item,
              quantity: clampQuantity(
                quantity,
                item.maximumQuantity,
              ),
            },
          ],
        };
      }

      return {
        items: state.items.map((cartItem) =>
          cartItem.productId === item.productId
            ? {
                ...cartItem,
                maximumQuantity: item.maximumQuantity,
                quantity: clampQuantity(
                  cartItem.quantity + quantity,
                  item.maximumQuantity,
                ),
              }
            : cartItem,
        ),
      };
    }),

  setQuantity: (productId, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: clampQuantity(
                quantity,
                item.maximumQuantity,
              ),
            }
          : item,
      ),
    })),

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter(
        (item) => item.productId !== productId,
      ),
    })),

  clear: () => set({ items: [] }),
}));
