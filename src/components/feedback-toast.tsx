import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing } from '@/theme/design-tokens';

type FeedbackToastProps = {
  visible: boolean;
  message: string;
};

export function FeedbackToast({
  visible,
  message,
}: FeedbackToastProps) {
  if (!visible) {
    return null;
  }

  return (
    <View
      style={styles.toast}
      pointerEvents="none"
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Ionicons
        name="checkmark-circle"
        size={22}
        color={colors.white}
      />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: spacing[4],
    right: spacing[4],
    bottom: spacing[6],
    zIndex: 10,
    minHeight: 56,
    maxWidth: 520,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    borderRadius: radii.medium,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    backgroundColor: colors.primaryDark,
  },
  message: {
    flex: 1,
    color: colors.white,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
  },
});
