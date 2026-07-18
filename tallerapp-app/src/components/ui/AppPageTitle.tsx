import React from "react";
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Colors } from "@/constants/theme";

type AppPageTitleProps = {
  title: string;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export default function AppPageTitle({
  title,
  icon,
  style,
  textStyle,
}: AppPageTitleProps) {
  const scheme = useColorScheme() ?? "light";
  const colors = Colors[scheme];

  return (
    <View style={[styles.container, style]}>
      {icon}
      <Text
        style={[
          styles.title,
          { color: colors.text },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingTop: 28,
    paddingHorizontal: 28,
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
});