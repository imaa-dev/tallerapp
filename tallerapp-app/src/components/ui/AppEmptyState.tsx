import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

type Props = {
  title: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  action?: React.ReactNode;
};

export default function AppEmptyState({
  title,
  description,
  icon = 'folder-open-outline',
  action,
}: Props) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  return (
    <View style={styles.container}>
      <Ionicons
        name={icon}
        size={70}
        color={colors.placeholder}
      />

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

      {!!description && (
        <Text
          style={[
            styles.description,
            {
              color: colors.subtitle,
            },
          ]}
        >
          {description}
        </Text>
      )}

      {action && (
        <View style={styles.action}>
          {action}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',

    paddingHorizontal: 32,
  },

  title: {
    marginTop: 18,

    fontSize: 22,

    fontWeight: '700',

    textAlign: 'center',
  },

  description: {
    marginTop: 10,

    fontSize: 15,

    textAlign: 'center',

    lineHeight: 22,
  },

  action: {
    marginTop: 28,

    width: '100%',
  },
});