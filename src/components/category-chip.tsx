import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing } from '@/theme/design-tokens';

type CategoryChipProps = { label: string; selected?: boolean };

export function CategoryChip({ label, selected = false }: CategoryChipProps) {
  return (
    <View style={[styles.chip, selected && styles.chipSelected]}>
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: { minHeight: 40, borderWidth: 1, borderColor: colors.border, borderRadius: radii.full, paddingHorizontal: spacing[4], alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  chipSelected: { borderColor: colors.primaryDark, backgroundColor: colors.primaryDark },
  label: { color: colors.textSecondary, fontSize: 14, fontWeight: '600' },
  labelSelected: { color: colors.white },
});
