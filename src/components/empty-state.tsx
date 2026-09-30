import { Ionicons } from '@expo/vector-icons';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors, radii, spacing } from '@/theme/design-tokens';

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons
          name="search-outline"
          size={28}
          color={colors.primaryDark}
        />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {actionLabel && onAction && (
        <TouchableOpacity
          style={styles.action}
          onPress={onAction}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 240,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[8],
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.imagePlaceholder,
    marginBottom: spacing[4],
  },
  title: {
    color: colors.text,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  description: {
    maxWidth: 320,
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  action: {
    minHeight: 48,
    borderRadius: radii.full,
    paddingHorizontal: spacing[6],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryDark,
    marginTop: spacing[5],
  },
  actionText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
});