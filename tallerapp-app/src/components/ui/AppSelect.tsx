import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
} from 'react-native';

import { Colors } from '@/constants/theme';
import SelectBottomSheet from '@/components/SelectBottomSheet';

type Option = {
  label: string;
  value: number | string;
};

type Props = {
  label?: string;
  placeholder?: string;
  title: string;

  data: Option[];

  selected: Option | null;

  onSelect: (item: Option) => void;

  error?: string;

  required?: boolean;
};

export default function AppSelect({
  label,
 placeholder,
  title,
  data,
  selected,
  onSelect,
  error,
  required = false,
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

      <View
        style={[
          styles.selectContainer,
          {
            borderColor: error
              ? colors.danger
              : colors.border,

            backgroundColor: colors.surface,
          },
        ]}
      >
        <SelectBottomSheet
          data={data}
          selected={selected}
          onSelect={onSelect}
          placeholder={placeholder}
          title={title}
        />
      </View>

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
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },

  selectContainer: {
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 54,

    justifyContent: 'center',

    overflow: 'hidden',
  },

  error: {
    marginTop: 6,
    fontSize: 13,
  },
});