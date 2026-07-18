import React from "react";
import {
  Text,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
  useColorScheme,
} from "react-native";

import { Colors } from "@/constants/theme";

type AppSectionTitleProps = {
  children: React.ReactNode;
  style?: TextStyle;
  containerStyle?: ViewStyle;
};

export default function AppSectionTitle({
  children,
  style,
  containerStyle,
}: AppSectionTitleProps) {
  const scheme = useColorScheme() ?? "light";
  const colors = Colors[scheme];

  return (
    <View style={[styles.container, containerStyle]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 32,
    justifyContent: "center",
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    opacity: 0.7,
  },
});