import React from 'react';
import {
  Text,
  StyleSheet,
  TextStyle,
  useColorScheme,
} from 'react-native';

import { Colors } from '@/constants/theme';

type AppSectionTitleProps = {
  children: React.ReactNode;
  style?: TextStyle;
};

export default function AppSectionTitle({
  children,
  style,
}: AppSectionTitleProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  return (
    <Text
      style={[
        styles.title,
        {
          color: colors.text,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 18,
  },
});