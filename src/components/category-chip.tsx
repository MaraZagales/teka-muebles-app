import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { colors, radii, spacing } from '@/theme/design-tokens';

type CategoryChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function CategoryChip({
  label,
  selected = false,
  onPress,
}: CategoryChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.8}
      style={[styles.chip, selected && styles.chipSelected]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`Filtrar por ${label}`}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 40,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.full,
    paddingHorizontal: spacing[4],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  chipSelected: {
    borderColor: colors.primaryDark,
    backgroundColor: colors.primaryDark,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  labelSelected: {
    color: colors.white,
  },
});