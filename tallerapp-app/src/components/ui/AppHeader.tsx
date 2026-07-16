import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useColorScheme,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

type Props = {
  title: string;
  subtitle?: string;

  showBack?: boolean;
  onBack?: () => void;

  right?: React.ReactNode;
};

export default function AppHeader({
  title,
  subtitle,
  showBack = false,
  onBack,
  right,
}: Props) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.left}>
        {showBack && (
          <Pressable
            onPress={onBack}
            style={styles.backButton}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={colors.text}
            />
          </Pressable>
        )}

        <View>
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

          {!!subtitle && (
            <Text
              style={[
                styles.subtitle,
                {
                  color: colors.subtitle,
                },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {right && (
        <View>
          {right}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    borderBottomWidth: 1,
  },

  left: {
    flexDirection: 'row',

    alignItems: 'center',

    flex: 1,
  },

  backButton: {
    marginRight: 12,

    width: 40,
    height: 40,

    borderRadius: 20,

    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
  },

  subtitle: {
    marginTop: 2,

    fontSize: 14,
  },
});