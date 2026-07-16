import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';

import { Colors } from '@/constants/theme';

type AppLoadingProps = {
  message?: string;
  fullScreen?: boolean;
};

export default function AppLoading({
  message = 'Cargando...',
  fullScreen = true,
}: AppLoadingProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  return (
    <View
      style={[
        styles.container,
        fullScreen && styles.fullScreen,
      ]}
    >
      <ActivityIndicator
        size="large"
        color={colors.primary}
      />

      <Text
        style={[
          styles.text,
          {
            color: colors.subtitle,
          },
        ]}
      >
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },

  fullScreen: {
    flex: 1,
  },

  text: {
    marginTop: 16,
    fontSize: 15,
    fontWeight: '500',
  },
});