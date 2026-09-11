import React, { PropsWithChildren } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, type Href } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/theme";
import ServiceStatusTabs from "@/components/services/ServiceStatusTabs";

/**
 * Marco comun para las listas de Servicios:
 * - tabs superiores desplazables para los estados
 * - contenido de la lista
 * - FAB (+) para crear un servicio
 */
export default function ServiceStatusScaffold({
  children,
}: PropsWithChildren) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme() ?? "dark";
  const colors = Colors[scheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ServiceStatusTabs />

      <View style={styles.content}>{children}</View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Crear servicio"
        hitSlop={8}
        onPress={() => router.push("/create" as Href)}
        style={({ pressed }) => [
          styles.fab,
          {
            bottom: Math.max(insets.bottom, 12) + 16,
            backgroundColor: colors.primary,
          },
          pressed && styles.fabPressed,
        ]}
      >
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    elevation: 7,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 7,
  },
  fabPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
});
