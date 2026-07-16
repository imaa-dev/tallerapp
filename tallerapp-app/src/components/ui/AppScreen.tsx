import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  useColorScheme,
  ViewStyle,
} from "react-native";

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