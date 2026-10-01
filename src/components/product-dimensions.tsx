import { StyleSheet, Text, View } from 'react-native';

import type { ProductDimensions as ProductDimensionsValue } from '@/data/product-specifications';
import { colors, radii, spacing } from '@/theme/design-tokens';

type ProductDimensionsProps = {
  dimensions: ProductDimensionsValue;
};

const dimensionItems = [
  { key: 'widthCm', label: 'ANCHO' },
  { key: 'heightCm', label: 'ALTO' },
  { key: 'depthCm', label: 'PROFUNDIDAD' },
] as const;

export function ProductDimensions({
  dimensions,
}: ProductDimensionsProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>MEDIDAS APROXIMADAS</Text>
      <View style={styles.row}>
        {dimensionItems.map((item) => (
          <View key={item.key} style={styles.item}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>
              {dimensions[item.key]} cm
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing[6],
  },
  title: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginBottom: spacing[2],
  },
  row: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  item: {
    minWidth: 0,
    flex: 1,
    borderRadius: radii.small,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[3],
    backgroundColor: colors.background,
  },
  label: {
    color: colors.textMuted,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  value: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: spacing[1],
  },
});
