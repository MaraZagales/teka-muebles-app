import { router } from 'expo-router';
import { useMemo } from 'react';
import {
  ActivityIndicator,
  Image,
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
import { CategoryChip } from '@/components/category-chip';
import { ProductCard } from '@/components/product-card';
import { useCatalogData } from '@/hooks/use-catalog-data';
import { colors, radii, spacing } from '@/theme/design-tokens';

const ALL_CATEGORIES = 'Todos';
const MAX_FEATURED_PRODUCTS = 4;

export default function HomeScreen() {
  const { data, isLoading, isError, refetch } =
    useCatalogData();

  const featuredProducts = useMemo(
    () =>
      (data?.products ?? [])
        .filter((product) => product.image)
        .slice(0, MAX_FEATURED_PRODUCTS),
    [data?.products],
  );

  const categories = useMemo(
    () => [
      ALL_CATEGORIES,
      ...Array.from(
        new Set(
          (data?.productTypes ?? [])
            .map((type) => type.descripcion)
            .filter((category) => category.trim().length > 0),
        ),
      ),
    ],
    [data?.productTypes],
  );

  function openCatalog(category?: string) {
    if (!category || category === ALL_CATEGORIES) {
      router.push('./catalogo');
      return;
    }

    router.push({
      pathname: './catalogo',
      params: { categoria: category },
    });
  }

  function openProduct(productId: number) {
    router.push({
      pathname: '/producto/[id]',
      params: { id: productId.toString() },
    });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.background}
      />
      <AppHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.page}
      >
        <View style={styles.content}>
          <View style={styles.hero}>
            <Image
              source={require('../../assets/images/teka/Teka (6).png')}
              style={styles.heroImage}
              resizeMode="cover"
              accessibilityLabel="Ambiente amoblado por TEKA"
            />
            <View style={styles.heroOverlay} />
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>
                Espacios que se sienten tuyos
              </Text>
              <Text style={styles.heroDescription}>
                Encontrá muebles funcionales para disfrutar tu casa
                y hacer que cada ambiente se sienta más tuyo.
              </Text>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => openCatalog()}
                accessibilityRole="button"
                accessibilityLabel="Ver muebles"
              >
                <Text style={styles.primaryButtonText}>
                  VER MUEBLES
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.valueStrip}>
            <View style={styles.valueItem}>
              <Text style={styles.valueIcon}>✦</Text>
              <Text style={styles.valueText}>Fabricación cordobesa</Text>
            </View>
            <View style={styles.valueItem}>
              <Text style={styles.valueIcon}>✦</Text>
              <Text style={styles.valueText}>
                Muebles funcionales
              </Text>
            </View>
            <View style={styles.valueItem}>
              <Text style={styles.valueIcon}>✦</Text>
              <Text style={styles.valueText}>
                Uso responsable de materiales
              </Text>
            </View>
          </View>

          {isLoading ? (
            <View style={styles.feedbackContainer}>
              <ActivityIndicator
                size="large"
                color={colors.primaryDark}
              />
              <Text style={styles.feedbackText}>
                Cargando productos de TEKA...
              </Text>
            </View>
          ) : isError ? (
            <View style={styles.feedbackContainer}>
              <Text style={styles.feedbackTitle}>
                No pudimos cargar los productos
              </Text>
              <Text style={styles.feedbackText}>
                Revisá tu conexión y volvé a intentarlo.
              </Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => void refetch()}
                accessibilityRole="button"
                accessibilityLabel="Volver a intentar"
              >
                <Text style={styles.retryButtonText}>REINTENTAR</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionHeading}>
                  <Text style={styles.sectionKicker}>
                    EXPLORÁ NUESTRA COLECCIÓN
                  </Text>
                  <Text style={styles.sectionTitle}>Categorías</Text>
                </View>
                <TouchableOpacity
                  onPress={() => openCatalog()}
                  accessibilityRole="button"
                  accessibilityLabel="Ver todas las categorías"
                >
                  <Text style={styles.sectionLink}>Ver todas</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.categories}>
                {categories.map((category) => (
                  <CategoryChip
                    key={category}
                    label={category}
                    onPress={() => openCatalog(category)}
                  />
                ))}
              </View>

              <View style={styles.sectionHeader}>
                <View style={styles.sectionHeading}>
                  <Text style={styles.sectionKicker}>
                    ELEGIDOS PARA VOS
                  </Text>
                  <Text style={styles.sectionTitle}>
                    Productos destacados
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => openCatalog()}
                  accessibilityRole="button"
                  accessibilityLabel="Ver catálogo completo"
                >
                  <Text style={styles.sectionLink}>Ver catálogo</Text>
                </TouchableOpacity>
              </View>

              {featuredProducts.length === 0 ? (
                <View style={styles.feedbackContainer}>
                  <Text style={styles.feedbackTitle}>
                    No hay destacados disponibles
                  </Text>
                  <Text style={styles.feedbackText}>
                    Muy pronto vas a encontrar una selección de
                    muebles en esta sección.
                  </Text>
                </View>
              ) : (
                <View style={styles.productGrid}>
                  {featuredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onPress={() => openProduct(product.id)}
                    />
                  ))}
                </View>
              )}
            </>
          )}

          <View style={styles.sustainabilityCard}>
            <Text style={styles.sustainabilityKicker}>
              DISEÑO RESPONSABLE
            </Text>
            <Text style={styles.sustainabilityTitle}>
              Cada material cuenta
            </Text>
            <Text style={styles.sustainabilityDescription}>
              Estamos desarrollando nuevas formas de aprovechar los
              recortes de producción y transformarlos en muebles útiles.
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
  },
  hero: {
    height: 440,
    borderRadius: radii.large,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    marginTop: spacing[4],
    marginBottom: spacing[4],
  },
  heroImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(20, 18, 15, 0.48)',
  },
  heroContent: {
    padding: spacing[6],
  },
  heroKicker: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.8,
    marginBottom: spacing[2],
  },
  heroTitle: {
    maxWidth: 420,
    color: colors.white,
    fontSize: 36,
    lineHeight: 40,
    fontWeight: '900',
    marginBottom: spacing[3],
  },
  heroDescription: {
    maxWidth: 440,
    color: colors.whiteMuted,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: spacing[5],
  },
  primaryButton: {
    alignSelf: 'flex-start',
    minHeight: 48,
    borderRadius: radii.small,
    paddingHorizontal: spacing[5],
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  valueStrip: {
    padding: spacing[4],
    borderRadius: radii.medium,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
    marginBottom: spacing[10],
  },
  valueItem: {
    minWidth: 148,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  valueIcon: {
    color: colors.primary,
    fontSize: 16,
  },
  valueText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing[4],
    marginBottom: spacing[4],
  },
  sectionHeading: {
    flex: 1,
  },
  sectionKicker: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.6,
    marginBottom: spacing[1],
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '900',
  },
  sectionLink: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '800',
    paddingVertical: spacing[2],
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    marginBottom: spacing[10],
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing[6],
    marginBottom: spacing[10],
  },
  feedbackContainer: {
    minHeight: 180,
    borderRadius: radii.medium,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[6],
    marginBottom: spacing[10],
  },
  feedbackTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  feedbackText: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: spacing[3],
  },
  retryButton: {
    minHeight: 44,
    borderRadius: radii.full,
    paddingHorizontal: spacing[6],
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing[4],
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  sustainabilityCard: {
    borderRadius: radii.large,
    padding: spacing[6],
    backgroundColor: colors.accent,
    marginBottom: spacing[6],
  },
  sustainabilityKicker: {
    color: colors.primaryDark,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.6,
    marginBottom: spacing[2],
  },
  sustainabilityTitle: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '900',
    marginBottom: spacing[3],
  },
  sustainabilityDescription: {
    maxWidth: 520,
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 24,
  },
});
