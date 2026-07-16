import React, { ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  useColorScheme,
} from 'react-native';

import { Colors } from '@/constants/theme';

type Props = {
  title?: string;
  children: ReactNode;
  style?: ViewStyle;
};

export default function AppCard({
  title,
  children,
  style,
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {title && (
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
        >
          {title}
        </Text>
      )}

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,

    borderWidth: 1,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 4,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 18,
  },
});