import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { businessInfo } from '@/config/business-info';
import { colors, radii, spacing } from '@/theme/design-tokens';

type AppHeaderProps = {
  showBack?: boolean;
};

export function AppHeader({ showBack = false }: AppHeaderProps) {
  function goHome() {
    router.replace('/');
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

        {showBack && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={goHome}
            accessibilityRole="button"
            accessibilityLabel="Ir al inicio"
          >
            <Ionicons
              name="home-outline"
              size={21}
              color={colors.text}
            />
          </TouchableOpacity>
        )}
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
});
