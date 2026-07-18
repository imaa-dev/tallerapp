import { Platform } from 'react-native';

const primary = '#2563EB';

export const Colors = {
  light: {
    // Base
    text: '#111827',
    background: '#F5F7FA',

    // UI
    surface: '#FFFFFF',
    border: '#E5E7EB',

    // Primary
    tint: primary,
    primary,

    // Secondary
    subtitle: '#6B7280',
    placeholder: '#9CA3AF',

    // Status
    success: '#16A34A',
    warning: '#F59E0B',
    danger: '#DC2626',

    // Icons
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: primary,
    contrast: '#111111',
    contrastText: '#FFFFFF',
  },

  dark: {
    text: '#F9FAFB',
    background: '#111827',

    surface: '#1F2937',
    border: '#374151',

    tint: '#60A5FA',
    primary: '#60A5FA',

    subtitle: '#9CA3AF',
    placeholder: '#6B7280',

    success: '#22C55E',
    warning: '#FBBF24',
    danger: '#EF4444',

    icon: '#9CA3AF',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: '#60A5FA',
    contrast: '#111111',
    contrastText: '#FFFFFF',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono:
      "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});