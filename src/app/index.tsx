import { Image, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryChip } from '@/components/category-chip';
import { ProductCard } from '@/components/product-card';
import { categories, products } from '@/data/products';
import { colors, radii, spacing } from '@/theme/design-tokens';



export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>TEKA</Text>
          </View>
          <View style={styles.cartButton}>
            <Text style={styles.cartIcon}>🛒</Text>
            <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>0</Text></View>
          </View>
        </View>

        <View style={styles.hero}>
          <Image
            source={require('../../assets/images/teka/Teka (6).png')}
            style={styles.heroImage}
            resizeMode="cover"
            accessibilityLabel="Muebles de TEKA"
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Espacios que se sienten tuyos</Text>
            <Text style={styles.heroDescription}>Diseño y fabricación para cada rincón de tu casa.</Text>
            <View style={styles.heroButton}><Text style={styles.heroButtonText}>VER COLECCIÓN</Text></View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View><Text style={styles.sectionTitle}>Categorías</Text></View>
          <Text style={styles.sectionLink}>Ver todas</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
          {categories.map((category, index) => <CategoryChip key={category} label={category} selected={index === 0} />)}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <View><Text style={styles.sectionTitle}>Productos destacados</Text></View>
        </View>
        <View style={styles.productGrid}>
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </View>

        <View style={styles.originCard}>
          <Text style={styles.originIcon}>✦</Text>
          <View style={styles.originTextContainer}>
            <Text style={styles.originTitle}>Cada recorte cuenta</Text>
            <Text style={styles.originDescription}>Aprovechamos recortes de nuestra producción para crear nuevos muebles y darles otra oportunidad a los materiales.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing[4], paddingTop: spacing[2], paddingBottom: spacing[8] },
  header: { minHeight: 64, marginBottom: spacing[4], flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eyebrow: { color: colors.textMuted, fontSize: 8, fontWeight: '700', letterSpacing: 2 },
  logo: { color: colors.text, fontSize: 28, fontWeight: '900', letterSpacing: 4 },
  cartButton: { width: 48, height: 48, borderRadius: radii.full, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  cartIcon: { fontSize: 20 },
  cartBadge: { position: 'absolute', top: 0, right: 0, width: 20, height: 20, borderRadius: radii.full, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  cartBadgeText: { color: colors.white, fontSize: 12, fontWeight: '700' },
  hero: { height: 432, borderRadius: radii.large, overflow: 'hidden', justifyContent: 'flex-end', marginBottom: spacing[8] },
  heroImage: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, width: '100%', height: '100%' },
  heroOverlay: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(20, 18, 15, 0.42)' },
  heroContent: { padding: spacing[6] },
  heroKicker: { color: colors.accent, fontSize: 12, fontWeight: '800', letterSpacing: 2, marginBottom: spacing[2] },
  heroTitle: { maxWidth: 280, color: colors.white, fontSize: 36, lineHeight: 40, fontWeight: '800', marginBottom: spacing[3] },
  heroDescription: { maxWidth: 288, color: colors.white, fontSize: 16, lineHeight: 24, marginBottom: spacing[5] },
  heroButton: { alignSelf: 'flex-start', minHeight: 48, borderRadius: radii.small, paddingHorizontal: spacing[5], justifyContent: 'center', backgroundColor: colors.accent },
  heroButtonText: { color: colors.text, fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  sectionHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: spacing[4] },
  sectionKicker: { color: colors.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1.6, marginBottom: spacing[1] },
  sectionTitle: { color: colors.text, fontSize: 24, lineHeight: 32, fontWeight: '800' },
  sectionLink: { color: colors.primaryDark, fontSize: 12, fontWeight: '700', paddingBottom: spacing[1] },
  categories: { gap: spacing[2], paddingBottom: spacing[8] },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing[6], marginBottom: spacing[8] },
  originCard: { padding: spacing[5], borderRadius: radii.medium, backgroundColor: colors.primaryDark, flexDirection: 'row', alignItems: 'center', gap: spacing[4] },
  originIcon: { color: colors.accent, fontSize: 32 },
  originTextContainer: { flex: 1 },
  originTitle: { color: colors.white, fontSize: 20, lineHeight: 24, fontWeight: '800', marginBottom: spacing[1] },
  originDescription: { color: colors.whiteMuted, fontSize: 14, lineHeight: 20 },
});
