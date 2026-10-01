import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppFooter } from '@/components/app-footer';
import { AppHeader } from '@/components/app-header';
import { EmptyState } from '@/components/empty-state';
import { FeedbackToast } from '@/components/feedback-toast';
import { ProductGallery } from '@/components/product-gallery';
import { ProductDimensions } from '@/components/product-dimensions';
import { QuantitySelector } from '@/components/quantity-selector';
import { getProductDimensions } from '@/data/product-specifications';
import { useProductDetail } from '@/hooks/use-product-detail';
import { ApiRequestError } from '@/services/api-client';
import { useCartStore } from '@/store/cart-store';
import { colors, radii, spacing } from '@/theme/design-tokens';

function parseProductId(value: string | string[] | undefined): number | null {
  const candidate = Array.isArray(value) ? value[0] : value;
  const parsed = Number(candidate);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

type ProductToast = {
  id: number;
  message: string;
};

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const productId = parseProductId(id);
  const { data, isLoading, isError, error, refetch } =
    useProductDetail(productId);
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState<ProductToast | null>(null);

  const availableStock = data?.availableStock ?? 0;

  useEffect(() => {
    setQuantity((current) =>
      availableStock > 0
        ? Math.min(Math.max(current, 1), availableStock)
        : 1,
    );
  }, [availableStock]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = setTimeout(() => setToast(null), 2500);

    return () => clearTimeout(timeout);
  }, [toast]);

  if (productId === null) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.background}
        />
        <AppHeader showBack />
        <View style={styles.centeredState}>
          <EmptyState
            title="Producto no encontrado"
            description="El enlace del producto no es válido o ya no está disponible."
            actionLabel="VOLVER AL CATÁLOGO"
            onAction={() => router.replace('/catalogo')}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.background}
        />
        <AppHeader showBack />
        <View style={styles.centeredState}>
          <ActivityIndicator size="large" color={colors.primaryDark} />
          <Text style={styles.stateText}>Preparando el producto...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !data) {
    const productNotFound =
      error instanceof ApiRequestError && error.status === 404;

    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.background}
        />
        <AppHeader showBack />
        <View style={styles.centeredState}>
          <EmptyState
            title={
              productNotFound
                ? 'Producto no encontrado'
                : 'No pudimos cargar este producto'
            }
            description={
              productNotFound
                ? 'El producto no existe o ya no está disponible.'
                : 'Revisá tu conexión y volvé a intentarlo.'
            }
            actionLabel={
              productNotFound ? 'VOLVER AL CATÁLOGO' : 'REINTENTAR'
            }
            onAction={
              productNotFound
                ? () => router.replace('/catalogo')
                : () => void refetch()
            }
          />
        </View>
      </SafeAreaView>
    );
  }

  const { product } = data;
  const hasPrice = product.priceValue !== null && product.priceValue !== undefined;
  const canAddToCart = hasPrice && availableStock > 0;
  const productImages = product.images ?? (product.image ? [product.image] : []);
  const productDimensions = getProductDimensions(product.id);

  function addToCart() {
    if (!canAddToCart || product.priceValue === null || product.priceValue === undefined) {
      return;
    }

    addItem(
      {
        productId: product.id,
        name: product.name,
        code: product.code,
        price: product.priceValue,
        image: product.image,
        maximumQuantity: availableStock,
      },
      quantity,
    );

    setToast({
      id: Date.now(),
      message: `${product.name} se agregó al carrito.`,
    });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.background}
      />
      <AppHeader showBack />

      <FeedbackToast
        visible={toast !== null}
        message={toast?.message ?? ''}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.page}
      >
        <View style={styles.content}>
          <ProductGallery
            images={productImages}
            productName={product.name}
          />

          <View style={styles.infoCard}>
            <Text style={styles.category}>
              {product.category.toUpperCase()}
            </Text>
            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.price}>{product.price}</Text>

            <View
              style={[
                styles.availability,
                availableStock > 0
                  ? styles.availabilityInStock
                  : styles.availabilityOutOfStock,
              ]}
            >
              <Ionicons
                name={availableStock > 0 ? 'checkmark-circle' : 'close-circle'}
                size={18}
                color={
                  availableStock > 0
                    ? colors.primaryDark
                    : colors.textMuted
                }
              />
              <Text style={styles.availabilityText}>
                {availableStock === 0
                  ? 'Sin stock disponible'
                  : availableStock <= 3
                    ? `Últimas ${availableStock} ${
                        availableStock === 1 ? 'unidad' : 'unidades'
                      }`
                    : 'Disponible para comprar'}
              </Text>
            </View>

            <Text style={styles.description}>
              {product.description?.trim() ||
                'Consultanos para conocer más detalles sobre este mueble.'}
            </Text>

            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>CATEGORÍA</Text>
                <Text style={styles.detailValue}>{product.category}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>COLOR</Text>
                <Text style={styles.detailValue}>
                  {product.color || 'Sin especificar'}
                </Text>
              </View>
            </View>

            {productDimensions && (
              <ProductDimensions dimensions={productDimensions} />
            )}

            <View style={styles.purchasePanel}>
              <View style={styles.quantityBlock}>
                <Text style={styles.quantityLabel}>CANTIDAD</Text>
                <QuantitySelector
                  value={quantity}
                  maximum={Math.max(availableStock, 1)}
                  onChange={setQuantity}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.addButton,
                  !canAddToCart && styles.buttonDisabled,
                ]}
                onPress={addToCart}
                disabled={!canAddToCart}
                accessibilityRole="button"
                accessibilityLabel={`Agregar ${product.name} al carrito`}
                accessibilityState={{ disabled: !canAddToCart }}
              >
                <Ionicons
                  name="bag-add-outline"
                  size={21}
                  color={colors.white}
                />
                <Text style={styles.addButtonText}>
                  {hasPrice ? 'AGREGAR AL CARRITO' : 'PRECIO NO DISPONIBLE'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.arButton, styles.buttonDisabled]}
              disabled
              accessibilityRole="button"
              accessibilityLabel="Ver cómo queda en tu espacio, próximamente"
              accessibilityState={{ disabled: true }}
            >
              <Ionicons
                name="scan-outline"
                size={21}
                color={colors.primaryDark}
              />
              <Text style={styles.arButtonText}>
                VER CÓMO QUEDA EN TU ESPACIO
              </Text>
            </TouchableOpacity>
            <Text style={styles.arHint}>
              Realidad aumentada próximamente disponible.
            </Text>
          </View>

          <AppFooter />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  page: {
    paddingBottom: spacing[6],
  },
  content: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
  },
  infoCard: {
    marginTop: spacing[5],
    marginBottom: spacing[8],
    padding: spacing[5],
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.large,
    backgroundColor: colors.surface,
  },
  category: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.6,
    marginBottom: spacing[2],
  },
  title: {
    color: colors.text,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '900',
    marginBottom: spacing[2],
  },
  price: {
    color: colors.primaryDark,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '900',
  },
  availability: {
    alignSelf: 'flex-start',
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    borderRadius: radii.full,
    paddingHorizontal: spacing[3],
    marginTop: spacing[3],
    marginBottom: spacing[5],
  },
  availabilityInStock: {
    backgroundColor: '#E5EEE3',
  },
  availabilityOutOfStock: {
    backgroundColor: colors.imagePlaceholder,
  },
  availabilityText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '800',
  },
  description: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: spacing[6],
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
    marginBottom: spacing[6],
  },
  detailItem: {
    minWidth: 132,
    flex: 1,
    borderRadius: radii.small,
    padding: spacing[3],
    backgroundColor: colors.background,
  },
  detailLabel: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginBottom: spacing[1],
  },
  detailValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  purchasePanel: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  quantityBlock: {
    gap: spacing[2],
  },
  quantityLabel: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  addButton: {
    minHeight: 48,
    flex: 1,
    minWidth: 220,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    borderRadius: radii.small,
    paddingHorizontal: spacing[4],
    backgroundColor: colors.primaryDark,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  arButton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radii.small,
    marginTop: spacing[3],
  },
  arButtonText: {
    color: colors.primaryDark,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  arHint: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: spacing[2],
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  centeredState: {
    flex: 1,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[6],
  },
  stateText: {
    color: colors.textSecondary,
    fontSize: 16,
    marginTop: spacing[3],
  },
});
