import { Ionicons } from '@expo/vector-icons';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors, radii, spacing } from '@/theme/design-tokens';

type QuantitySelectorProps = {
  value: number;
  minimum?: number;
  maximum: number;
  onChange: (value: number) => void;
};

export function QuantitySelector({
  value,
  minimum = 1,
  maximum,
  onChange,
}: QuantitySelectorProps) {
  const canDecrease = value > minimum;
  const canIncrease = value < maximum;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, !canDecrease && styles.buttonDisabled]}
        onPress={() => onChange(Math.max(minimum, value - 1))}
        disabled={!canDecrease}
        accessibilityRole="button"
        accessibilityLabel="Disminuir cantidad"
        accessibilityState={{ disabled: !canDecrease }}
      >
        <Ionicons
          name="remove"
          size={20}
          color={canDecrease ? colors.text : colors.textMuted}
        />
      </TouchableOpacity>

      <Text
        style={styles.value}
        accessibilityLabel={`Cantidad seleccionada: ${value}`}
      >
        {value}
      </Text>

      <TouchableOpacity
        style={[styles.button, !canIncrease && styles.buttonDisabled]}
        onPress={() => onChange(Math.min(maximum, value + 1))}
        disabled={!canIncrease}
        accessibilityRole="button"
        accessibilityLabel="Aumentar cantidad"
        accessibilityState={{ disabled: !canIncrease }}
      >
        <Ionicons
          name="add"
          size={20}
          color={canIncrease ? colors.text : colors.textMuted}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.small,
    backgroundColor: colors.surface,
  },
  button: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  value: {
    minWidth: 40,
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
    paddingHorizontal: spacing[2],
  },
});
