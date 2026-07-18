import React from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  useColorScheme,
} from "react-native";

import { Colors } from "@/constants/theme";

type AppErrorTextProps = {
  children?: React.ReactNode;
  style?: TextStyle;
};

export default function AppErrorText({
  children,
  style,
}: AppErrorTextProps) {
  const scheme = useColorScheme() ?? "light";
  const colors = Colors[scheme];

  if (!children) return null;

  return (
    <Text
      style={[
        styles.text,
        {
          color: colors.error ?? "#ef4444",
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "500",
  },
});