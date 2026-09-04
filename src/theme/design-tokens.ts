/** Sistema visual basado en múltiplos de 4. */
export const spacing = { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48, 16: 64 } as const;

export const radii = { small: 8, medium: 16, large: 24, full: 999 } as const;

export const colors = {
  background: '#F7F4EE', surface: '#FFFFFF', primary: '#6F876B', primaryDark: '#3F5140', accent: '#D9B36C',
  text: '#292524', textSecondary: '#57534E', textMuted: '#78716C', white: '#FFFFFF', whiteMuted: '#E7E5E4',
  border: '#DED8CF', imagePlaceholder: '#E8E1D7',
} as const;
