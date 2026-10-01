import { useEffect, useState } from 'react';
import {
  Image,
  type ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors, radii, spacing } from '@/theme/design-tokens';

type ProductGalleryProps = {
  images: ImageSourcePropType[];
  productName: string;
};

export function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [images]);

  if (images.length === 0) {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackBrand}>TEKA</Text>
        <Text style={styles.fallbackText}>Imagen próximamente</Text>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.mainImageContainer}>
        <Image
          source={images[selectedIndex]}
          style={styles.mainImage}
          resizeMode="contain"
          accessibilityLabel={`${productName}, imagen ${selectedIndex + 1}`}
        />
      </View>

      {images.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbnails}
        >
          {images.map((image, index) => {
            const selected = index === selectedIndex;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.thumbnailButton,
                  selected && styles.thumbnailButtonSelected,
                ]}
                onPress={() => setSelectedIndex(index)}
                accessibilityRole="button"
                accessibilityLabel={`Ver imagen ${index + 1} de ${productName}`}
                accessibilityState={{ selected }}
              >
                <Image
                  source={image}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainImageContainer: {
    aspectRatio: 1,
    overflow: 'hidden',
    borderRadius: radii.large,
    backgroundColor: colors.imagePlaceholder,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  thumbnails: {
    gap: spacing[3],
    paddingTop: spacing[3],
    paddingBottom: spacing[1],
  },
  thumbnailButton: {
    width: 72,
    height: 72,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: radii.small,
    backgroundColor: colors.imagePlaceholder,
  },
  thumbnailButtonSelected: {
    borderColor: colors.primary,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.large,
    backgroundColor: colors.imagePlaceholder,
  },
  fallbackBrand: {
    color: colors.primaryDark,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 6,
    marginBottom: spacing[2],
  },
  fallbackText: {
    color: colors.textMuted,
    fontSize: 14,
  },
});
