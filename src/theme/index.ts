export type ThemeMode = 'light' | 'dark';

export interface Theme {
  mode: ThemeMode;
  colors: typeof import('./colors').lightColors;
  spacing: typeof import('./spacing').spacing;
  radii: typeof import('./radii').radii;
  typography: typeof import('./typography').typography;
}

import { lightColors, darkColors } from './colors';
import { spacing } from './spacing';
import { radii } from './radii';
import { typography } from './typography';

export const lightTheme: Theme = {
  mode: 'light',
  colors: lightColors,
  spacing,
  radii,
  typography,
};

export const darkTheme: Theme = {
  mode: 'dark',
  colors: darkColors,
  spacing,
  radii,
  typography,
};

export { lightColors, darkColors, spacing, radii, typography };
