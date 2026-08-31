module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|react-native-paper|@gorhom/.*|react-native-toast-message|react-native-phone-number-input|react-native-reanimated|react-native-gesture-handler|react-native-screens|react-native-safe-area-context|@react-native-community/datetimepicker|@react-native-picker/picker|expo-.*|lucide-react-native)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^lucide-react-native$': '<rootDir>/src/__mocks__/lucide-react-native.js',
  },
  testMatch: ['**/__tests__/**/*.{ts,tsx}', '**/*.test.{ts,tsx}'],
};
