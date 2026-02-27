import { Platform } from 'react-native';

const colors = {
  background: '#08080C',
  surface: '#111116',
  surfaceElevated: '#1A1A22',
  border: '#1E1E28',
  borderActive: '#2A2A36',
  primary: '#E63946',
  primaryDim: '#E6394620',
  primaryGlow: '#E6394640',
  textPrimary: '#EAEAF0',
  textSecondary: '#8B8B9A',
  textTertiary: '#4A4A58',
  textAccent: '#E63946',
  success: '#22C55E',
  warning: '#F59E0B',
};

const typography = {
  heading: {
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'sans-serif',
    fontWeight: '800' as const,
  },
  subheading: {
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'sans-serif',
    fontWeight: '700' as const,
  },
  body: {
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'sans-serif',
    fontWeight: '400' as const,
  },
  caption: {
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
    fontWeight: '600' as const,
  },
};

const spacingConfig = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 100,
};

const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  glow: {
    shadowColor: '#E63946',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
};

export const theme = {
  colors,
  typography,
  spacing: spacingConfig,
  borderRadius,
  shadows,
};

export type Theme = typeof theme;

export const useTheme = (): Theme => {
  return theme;
};

// Helper functions

/**
 * Returns an rgba string from a hex color.
 * Supports #RRGGBB format.
 */
export const withOpacity = (hexColor: string, opacity: number): string => {
  const hex = hexColor.replace('#', '');
  if (hex.length === 6) {
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return hexColor; // Fallback
};

/**
 * Spacing utility for padding/margin shorthand.
 * Returns a number if 1 argument is provided (useful for React Native styles).
 * Returns a space-separated string of pixel values if multiple arguments are provided.
 */
export const spacing = (...args: number[]): number | string => {
  if (args.length === 1) {
    return args[0];
  }
  return args.map((val) => `${val}px`).join(' ');
};
