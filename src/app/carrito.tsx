import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppFooter } from '@/components/app-footer';
import { AppHeader } from '@/components/app-header';
import { ActionModal } from '@/components/action-modal';
import { EmptyState } from '@/components/empty-state';
import { QuantitySelector } from '@/components/quantity-selector';
import { type CartItem, useCartStore } from '@/store/cart-store';
import { colors, radii, spacing } from '@/theme/design-tokens';

function formatPrice(value: number): string {
  return `$ ${Math.round(value).toLocaleString('es-AR')}`;
}

type PendingAction = {
  title: string;
  description: string;
  primaryLabel: string;
  onPrimary: () => void;
};

export default function CartScreen() {
  const items = useCartStore((state) => state.items);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clear = useCartStore((state) => state.clear);
  const [pendingAction, setPendingAction] =
    useState<PendingAction | null>(null);

  const totalUnits = items.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  const total = items.reduce(
    (amount, item) => amount + item.price * item.quantity,
    0,
  );

  function confirmRemove(item: CartItem) {
    setPendingAction({
      title: 'Quitar producto',
      description: `¿Querés quitar ${item.name} del carrito?`,
      primaryLabel: 'QUITAR',
      onPrimary: () => removeItem(item.productId),
    });
  }

  function confirmClear() {
    setPendingAction({
      title: 'Vaciar carrito',
      description: '¿Querés quitar todos los productos del carrito?',
      primaryLabel: 'VACIAR',
      onPrimary: clear,
    });
  }

  function runPendingAction() {
    const action = pendingAction;
    setPendingAction(null);
    action?.onPrimary();
  }

  function renderItem({ item }: { item: CartItem }) {
    return (
      <View style={styles.itemCard}>
        <View style={styles.itemImageContainer}>
          {item.image ? (
            <Image
              source={item.image}
              style={styles.itemImage}
              resizeMode="contain"
              accessibilityLabel={item.name}
            />
          ) : (
            <Text style={styles.imageFallback}>TEKA</Text>
          )}
        </View>

        <View style={styles.itemInfo}>
          <View style={styles.itemTitleRow}>
            <Text style={styles.itemName}>{item.name}</Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => confirmRemove(item)}
              accessibilityRole="button"
              accessibilityLabel={`Quitar ${item.name} del carrito`}
            >
              <Ionicons
                name="trash-outline"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>

          <View style={styles.quantityContainer}>
            <QuantitySelector
              value={item.quantity}
              maximum={item.maximumQuantity}
              onChange={(quantity) =>
                setQuantity(item.productId, quantity)
              }
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.background}
      />
      <AppHeader showBack />

      <ActionModal
        visible={pendingAction !== null}
        title={pendingAction?.title ?? ''}
        description={pendingAction?.description ?? ''}
        primaryLabel={pendingAction?.primaryLabel ?? 'ACEPTAR'}
        secondaryLabel="CANCELAR"
        onPrimary={runPendingAction}
        onSecondary={() => setPendingAction(null)}
      />

      <FlatList
        data={items}
        keyExtractor={(item) => item.productId.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.kicker}>TU SELECCIÓN</Text>
            <View style={styles.titleRow}>
              <Text style={styles.title}>Carrito</Text>
              {items.length > 0 && (
                <TouchableOpacity
                  onPress={confirmClear}
                  accessibilityRole="button"
                  accessibilityLabel="Vaciar carrito"
                >
                  <Text style={styles.clearText}>Vaciar</Text>
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.description}>
              Revisá los muebles y las cantidades antes de continuar.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="Tu carrito está vacío"
            description="Explorá el catálogo y agregá los muebles que más te gusten."
            actionLabel="VER MUEBLES"
            onAction={() => router.replace('/catalogo')}
          />
        }
        ListFooterComponent={
          <View>
            {items.length > 0 && (
              <View style={styles.summary}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Productos</Text>
                  <Text style={styles.summaryValue}>{totalUnits}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>{formatPrice(total)}</Text>
                </View>
                <Text style={styles.summaryHint}>
                  La disponibilidad se volverá a validar al confirmar la compra.
                </Text>
                <TouchableOpacity
                  style={styles.catalogButton}
                  onPress={() => router.push('/catalogo')}
                  accessibilityRole="button"
                  accessibilityLabel="Seguir viendo muebles"
                >
                  <Text style={styles.catalogButtonText}>
                    SEGUIR VIENDO MUEBLES
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.footerContainer}>
              <AppFooter />
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    width: '100%',
    maxWidth: 720,
    flexGrow: 1,
    alignSelf: 'center',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[6],
  },
  header: {
    marginBottom: spacing[6],
  },
  kicker: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.6,
    marginBottom: spacing[1],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[4],
  },
  title: {
    color: colors.text,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '900',
  },
  clearText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
  description: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 23,
    marginTop: spacing[2],
  },
  itemCard: {
    flexDirection: 'row',
    gap: spacing[4],
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.medium,
    padding: spacing[3],
    backgroundColor: colors.surface,
    marginBottom: spacing[3],
  },
  itemImageContainer: {
    width: 112,
    height: 112,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: radii.small,
    backgroundColor: colors.imagePlaceholder,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  imageFallback: {
    color: colors.primaryDark,
    fontWeight: '900',
    letterSpacing: 2,
  },
  itemInfo: {
    flex: 1,
    minWidth: 0,
  },
  itemTitleRow: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing[2],
  },
  itemName: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '800',
  },
  itemPrice: {
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: '900',
    marginTop: spacing[2],
    marginBottom: spacing[3],
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.full,
    backgroundColor: colors.background,
  },
  summary: {
    borderRadius: radii.large,
    padding: spacing[5],
    backgroundColor: colors.primaryDark,
    marginTop: spacing[5],
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[3],
  },
  summaryLabel: {
    color: colors.whiteMuted,
    fontSize: 14,
  },
  summaryValue: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: spacing[4],
  },
  totalLabel: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '900',
  },
  totalValue: {
    color: colors.accent,
    fontSize: 20,
    fontWeight: '900',
  },
  summaryHint: {
    color: colors.whiteMuted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: spacing[4],
  },
  catalogButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.small,
    backgroundColor: colors.accent,
    marginTop: spacing[4],
  },
  catalogButtonText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  footerContainer: {
    marginTop: spacing[8],
  },
});
