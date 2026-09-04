import { Image, StyleSheet, Text, View } from 'react-native';

import type { Product } from '@/data/products';
import { colors, radii, spacing } from '@/theme/design-tokens';

type ProductCardProps = { product: Product };

export function ProductCard({ product }: ProductCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={product.image}
          style={styles.image}
          resizeMode="contain"
          accessibilityLabel={product.name}/>{product.isNew && <View style={styles.badge}><Text style={styles.badgeText}>NUEVO</Text></View>}
      </View>
      <Text style={styles.category}>{product.category.toUpperCase()}</Text>
      <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
      <Text style={styles.price}>{product.price}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: '48%' },
  imageContainer: { aspectRatio: 1, borderRadius: radii.medium, overflow: 'hidden', backgroundColor: colors.imagePlaceholder, marginBottom: spacing[3] },
  image: { width: '100%', height: '100%' },
  badge: { position: 'absolute', top: spacing[2], left: spacing[2], minHeight: 24, borderRadius: radii.small, paddingHorizontal: spacing[2], justifyContent: 'center', backgroundColor: colors.accent },
  badgeText: { color: colors.text, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  category: { color: colors.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1.2, marginBottom: spacing[1] },
  name: { color: colors.text, fontSize: 16, lineHeight: 20, fontWeight: '700', marginBottom: spacing[1],
  },
  price: { color: colors.textSecondary, fontSize: 14, fontWeight: '700' },
});
