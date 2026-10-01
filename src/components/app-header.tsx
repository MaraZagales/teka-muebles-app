import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { businessInfo } from '@/config/business-info';
import { useCartStore } from '@/store/cart-store';
import { colors, radii, spacing } from '@/theme/design-tokens';

type AppHeaderProps = {
  showBack?: boolean;
};

export function AppHeader({ showBack = false }: AppHeaderProps) {
  const cartUnits = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );

  function goHome() {
    router.replace('/');
  }

  function openCart() {
    router.push('/carrito');
  }

  return (
    <View style={styles.shell}>
      <View style={styles.container}>
        {showBack && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Volver"
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={colors.text}
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.brand}
          onPress={goHome}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Ir al inicio de TEKA"
        >
          <Text style={styles.brandName}>{businessInfo.name}</Text>
          <Text style={styles.brandTagline}>
            {businessInfo.tagline.toUpperCase()}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={openCart}
          accessibilityRole="button"
          accessibilityLabel={`Abrir carrito, ${cartUnits} ${
            cartUnits === 1 ? 'producto' : 'productos'
          }`}
        >
          <Ionicons
            name="bag-handle-outline"
            size={22}
            color={colors.text}
          />
          {cartUnits > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>
                {cartUnits > 99 ? '99+' : cartUnits}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  container: {
    width: '100%',
    maxWidth: 720,
    minHeight: 72,
    alignSelf: 'center',
    paddingHorizontal: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  brand: {
    flex: 1,
  },
  brandName: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 4,
  },
  brandTagline: {
    color: colors.textMuted,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginTop: spacing[1],
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 20,
    height: 20,
    borderRadius: radii.full,
    paddingHorizontal: spacing[1],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
  },
  cartBadgeText: {
    color: colors.text,
    fontSize: 10,
    fontWeight: '900',
  },
});
