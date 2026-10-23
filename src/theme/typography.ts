export const typography = {
  fontFamily: 'System',
  fontFamilyHeading: 'System',

  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    '2xl': 28,
    '3xl': 34,
    '4xl': 42,
  } as const,

  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },
} as const;

export type FontSize = keyof typeof typography.sizes;
export type FontWeight = keyof typeof typography.weights;
