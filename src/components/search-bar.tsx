import { Ionicons } from '@expo/vector-icons';
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { colors, radii, spacing } from '@/theme/design-tokens';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Buscar muebles',
}: SearchBarProps) {
  function clearSearch() {
    onChangeText('');
  }

  return (
    <View style={styles.container}>
      <Ionicons
        name="search-outline"
        size={20}
        color={colors.textMuted}
      />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        accessibilityLabel="Buscar productos"
      />

      {value.length > 0 && (
        <TouchableOpacity
          onPress={clearSearch}
          style={styles.clearButton}
          accessibilityRole="button"
          accessibilityLabel="Limpiar búsqueda"
        >
          <Ionicons
            name="close-circle"
            size={20}
            color={colors.textMuted}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 48,
    paddingHorizontal: spacing[4],
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.medium,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  input: {
    flex: 1,
    minHeight: 48,
    color: colors.text,
    fontSize: 16,
  },
  clearButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});