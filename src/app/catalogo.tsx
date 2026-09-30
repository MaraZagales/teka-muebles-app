import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppFooter } from '@/components/app-footer';
import { AppHeader } from '@/components/app-header';
import { CategoryChip } from '@/components/category-chip';
import { EmptyState } from '@/components/empty-state';
import { ProductCard } from '@/components/product-card';
import { SearchBar } from '@/components/search-bar';
import type { Product } from '@/data/products';
import { useCatalogData } from '@/hooks/use-catalog-data';
import { colors, radii, spacing } from '@/theme/design-tokens';

const ALL_CATEGORIES = 'Todos';

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es-AR')
    .trim();
}

export default function CatalogScreen() {
  const { categoria } = useLocalSearchParams<{
    categoria?: string;
  }>();
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(
    categoria ?? ALL_CATEGORIES,
  );

  const { data, isLoading, isError, refetch } =
    useCatalogData();

  useEffect(() => {
    setSelectedCategory(categoria ?? ALL_CATEGORIES);
  }, [categoria]);

  const catalogProducts = useMemo(
    () => data?.products ?? [],
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

  const filteredProducts = useMemo(() => {
    const normalizedSearch = normalizeText(searchText);

    return catalogProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === ALL_CATEGORIES ||
        product.category === selectedCategory;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        normalizeText(product.name).includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [catalogProducts, searchText, selectedCategory]);

  const hasActiveFilters =
    searchText.trim().length > 0 ||
    selectedCategory !== ALL_CATEGORIES;

  function clearFilters() {
    setSearchText('');
    setSelectedCategory(ALL_CATEGORIES);
    router.setParams({ categoria: undefined });
  }

  function selectCategory(category: string) {
    setSelectedCategory(category);
    router.setParams({
      categoria:
        category === ALL_CATEGORIES ? undefined : category,
    });
  }

  function renderProduct({ item }: { item: Product }) {
    return <ProductCard product={item} />;
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
          <ActivityIndicator
            size="large"
            color={colors.primaryDark}
          />
          <Text style={styles.stateText}>
            Preparando nuestro catálogo...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.background}
        />
        <AppHeader showBack />
        <View style={styles.errorContent}>
          <EmptyState
            title="No pudimos cargar el catálogo"
            description="Revisá tu conexión y volvé a intentarlo."
            actionLabel="REINTENTAR"
            onAction={() => void refetch()}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.background}
      />
      <AppHeader showBack />

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProduct}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View>
            <View style={styles.catalogIntro}>
              <Text style={styles.catalogKicker}>CATÁLOGO</Text>
              <Text style={styles.catalogTitle}>
                Encontrá el mueble ideal para tu espacio
              </Text>
              <Text style={styles.catalogDescription}>
                Explorá nuestra colección, buscá por nombre o elegí
                una categoría para encontrar lo que necesitás.
              </Text>
            </View>

            <View style={styles.filtersPanel}>
              <Text style={styles.filterTitle}>
                ¿Qué estás buscando?
              </Text>
              <SearchBar
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Buscar muebles"
              />

              <Text style={styles.filterLabel}>CATEGORÍAS</Text>
              <View style={styles.categories}>
                {categories.map((category) => (
                  <CategoryChip
                    key={category}
                    label={category}
                    selected={selectedCategory === category}
                    onPress={() => selectCategory(category)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.resultsHeader}>
              <View>
                <Text style={styles.resultsKicker}>RESULTADOS</Text>
                <Text style={styles.resultsTitle}>Muebles</Text>
              </View>
              <Text style={styles.resultsCount}>
                {filteredProducts.length}{' '}
                {filteredProducts.length === 1
                  ? 'mueble'
                  : 'muebles'}
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title={
              hasActiveFilters
                ? 'No encontramos coincidencias'
                : 'No hay productos disponibles'
            }
            description={
              hasActiveFilters
                ? 'Probá con otro nombre o seleccioná una categoría diferente.'
                : 'Todavía no hay muebles disponibles para mostrar.'
            }
            actionLabel={
              hasActiveFilters ? 'LIMPIAR FILTROS' : undefined
            }
            onAction={hasActiveFilters ? clearFilters : undefined}
          />
        }
        ListFooterComponent={
          <View style={styles.footerContainer}>
            <AppFooter />
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
  catalogIntro: {
    borderRadius: radii.large,
    padding: spacing[6],
    backgroundColor: colors.primaryDark,
    marginBottom: spacing[4],
  },
  catalogKicker: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.8,
    marginBottom: spacing[2],
  },
  catalogTitle: {
    maxWidth: 520,
    color: colors.white,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '900',
    marginBottom: spacing[3],
  },
  catalogDescription: {
    maxWidth: 520,
    color: colors.whiteMuted,
    fontSize: 15,
    lineHeight: 23,
  },
  filtersPanel: {
    borderRadius: radii.large,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[5],
    backgroundColor: colors.surface,
    marginBottom: spacing[8],
  },
  filterTitle: {
    color: colors.text,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800',
    marginBottom: spacing[4],
  },
  filterLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.6,
    marginTop: spacing[5],
    marginBottom: spacing[3],
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing[4],
    marginBottom: spacing[4],
  },
  resultsKicker: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.6,
    marginBottom: spacing[1],
  },
  resultsTitle: {
    color: colors.text,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '900',
  },
  resultsCount: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '800',
    paddingBottom: spacing[1],
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: spacing[6],
  },
  footerContainer: {
    marginTop: spacing[6],
  },
  centeredState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[6],
  },
  stateText: {
    color: colors.textSecondary,
    fontSize: 16,
    marginTop: spacing[3],
  },
  errorContent: {
    flex: 1,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[6],
  },
});
