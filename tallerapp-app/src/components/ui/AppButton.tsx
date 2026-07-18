import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
  useColorScheme,
} from 'react-native';

import { Colors } from '@/constants/theme';

type AppButtonProps = {
  title?: string;

  onPress?: () => void;

  loading?: boolean;

  disabled?: boolean;

  fullWidth?: boolean;

  variant?: 
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'contrast';

  icon?: React.ReactNode;

  style?: ViewStyle;
};


export default function AppButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  fullWidth = true,
  variant = 'primary',
  icon,
  style,
}: AppButtonProps) {

  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];


  const variants = {

    primary: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
      textColor: '#FFFFFF',
    },


    secondary: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      textColor: colors.text,
    },


    outline: {
      backgroundColor: 'transparent',
      borderColor: colors.primary,
      textColor: colors.primary,
    },

    contrast: {
      backgroundColor: colors.contrast,
      borderColor: colors.contrast,
      textColor: colors.contrastText,
    },

  }[variant];


  return (
    <Pressable
      disabled={disabled || loading}

      onPress={onPress}

      style={({ pressed }) => [
        styles.button,

        {
          backgroundColor: variants.backgroundColor,

          borderColor: variants.borderColor,

          opacity:
            pressed
              ? 0.85
              : disabled
                ? 0.5
                : 1,

          width: fullWidth
            ? '100%'
            : undefined,
        },

        style,
      ]}
    >

      {
        loading ? (

          <ActivityIndicator
            color={variants.textColor}
          />

        ) : (

          <>
            {icon}

            {
              title && (
                <Text
                  style={[
                    styles.text,
                    {
                      color: variants.textColor,
                    },
                  ]}
                >
                  {title}
                </Text>
              )
            }

          </>

        )
      }

    </Pressable>
  );
}


const styles = StyleSheet.create({

  button: {

    minHeight: 54,

    borderRadius: 14,

    borderWidth: 1,

    justifyContent: 'center',

    alignItems: 'center',

    flexDirection: 'row',

    gap: 10,

    paddingHorizontal: 20,

  },


  text: {

    fontSize: 16,

    fontWeight: '600',

  },

});