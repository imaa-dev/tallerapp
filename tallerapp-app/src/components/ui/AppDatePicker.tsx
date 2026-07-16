import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';

import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/theme';

type Props = {
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
  error?: string;
  required?: boolean;
};

export default function AppDatePicker({
  label,
  value,
  onChange,
  error,
  required = false,
}: Props) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  const openTimePicker = (date: Date) => {
    DateTimePickerAndroid.open({
      value: date,
      mode: 'time',
      is24Hour: true,
      onChange: (_, selectedTime) => {
        if (!selectedTime) return;

        const newDate = new Date(date);

        newDate.setHours(selectedTime.getHours());
        newDate.setMinutes(selectedTime.getMinutes());

        onChange(newDate);
      },
    });
  };

  const openDatePicker = () => {
    DateTimePickerAndroid.open({
      value,
      mode: 'date',
      onChange: (_, selectedDate) => {
        if (!selectedDate) return;

        const newDate = new Date(value);

        newDate.setFullYear(selectedDate.getFullYear());
        newDate.setMonth(selectedDate.getMonth());
        newDate.setDate(selectedDate.getDate());

        openTimePicker(newDate);
      },
    });
  };

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
            <Text style={{ color: colors.danger }}>
              {' '}*
            </Text>
          )}
        </Text>
      )}

      <Pressable
        onPress={openDatePicker}
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            borderColor: error
              ? colors.danger
              : colors.border,
          },
        ]}
      >
        <Ionicons
          name="calendar-outline"
          size={22}
          color={colors.primary}
        />

        <Text
          style={[
            styles.value,
            {
              color: colors.text,
            },
          ]}
        >
          {value.toLocaleString()}
        </Text>
      </Pressable>

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

  input: {
    minHeight: 54,

    borderRadius: 12,

    borderWidth: 1,

    paddingHorizontal: 16,

    flexDirection: 'row',

    alignItems: 'center',

    gap: 12,
  },

  value: {
    fontSize: 16,
  },

  error: {
    marginTop: 6,
    fontSize: 13,
  },
});