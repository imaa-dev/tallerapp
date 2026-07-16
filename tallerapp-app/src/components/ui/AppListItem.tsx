import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

type AppListItemProps = {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  onDelete?: () => void;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
};

export default function AppListItem({
  title,
  subtitle,
  onPress,
  onDelete,
  leftIcon = 'ellipse',
  rightIcon = 'trash-outline',
}: AppListItemProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.left}>
        <Ionicons
          name={leftIcon}
          size={18}
          color={colors.primary}
        />

        <View style={styles.textContainer}>
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

          {subtitle && (
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

      {onDelete && (
        <Pressable
          onPress={onDelete}
          hitSlop={10}
        >
          <Ionicons
            name={rightIcon}
            size={22}
            color={colors.danger}
          />
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 56,

    borderWidth: 1,

    borderRadius: 12,

    paddingHorizontal: 14,
    paddingVertical: 12,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    marginBottom: 10,
  },

  left: {
    flex: 1,

    flexDirection: 'row',
    alignItems: 'center',

    gap: 12,
  },

  textContainer: {
    flex: 1,
  },

  title: {
    fontSize: 15,
    fontWeight: '600',
  },

  subtitle: {
    marginTop: 2,
    fontSize: 13,
  },
});