import React from "react";
import {
  StyleSheet,
  useColorScheme,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/theme";


type AppScreenProps = {
  children: React.ReactNode;

  style?: ViewStyle;
};


export default function AppScreen({
  children,
  style,
}: AppScreenProps) {

  const scheme = useColorScheme() ?? "dark";

  const colors = Colors[scheme];


  return (

    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
        style,
      ]}
    >

      {children}

    </SafeAreaView>

  );
}


const styles = StyleSheet.create({

  container: {

    flex:1,

  },

});