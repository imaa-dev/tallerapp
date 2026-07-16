import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  useColorScheme,
} from 'react-native';

import { Colors } from '@/constants/theme';

type Props = TextInputProps & {
  label?: string;
  error?: string;
  required?: boolean;
};

export default function AppTextInput({
  label,
  error,
  required = false,
  style,
  ...props
}: Props) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  return (
    <View style={styles.container}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: colors.text,
            },
          ]}
        >
          {label}

          {required && (
            <Text
              style={{
                color: colors.danger,
              }}
            >
              {' '}*
            </Text>
          )}
        </Text>
      )}

      <TextInput
        placeholderTextColor={colors.placeholder}
        style={[
          styles.input,
          {
            color: colors.text,
            backgroundColor: colors.surface,
            borderColor: error
              ? colors.danger
              : colors.border,
          },
          style,
        ]}
        {...props}
      />

      {!!error && (
        <Text
          style={[
            styles.error,
            {
              color: colors.danger,
            },
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },

  label: {
    marginBottom: 8,

    fontSize: 15,

    fontWeight: '600',
  },

  input: {
    minHeight: 52,

    borderRadius: 12,

    borderWidth: 1,

    paddingHorizontal: 16,

    fontSize: 16,
  },

  error: {
    marginTop: 6,

    fontSize: 13,
  },
});