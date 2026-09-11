import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/theme";

/**
 * Navegacion interna del modulo Servicios.
 *
 * Drawer (modulo) -> Stack (profundidad) -> tabs superiores (estados)
 *
 * Los estados siguen siendo rutas independientes para mantener el codigo
 * existente, pero ya no se muestran como Bottom Tabs. El Stack se usa para
 * pantallas que agregan profundidad al flujo, como Crear servicio.
 */
export default function ServicesLayout() {
  const scheme = useColorScheme() ?? "dark";
  const colors = Colors[scheme];

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" options={{ animation: "none" }} />
      <Stack.Screen name="recepcionados" options={{ animation: "none" }} />
      <Stack.Screen name="diagnosticados" options={{ animation: "none" }} />
      <Stack.Screen name="repuestos" options={{ animation: "none" }} />
      <Stack.Screen name="aprobacion-costos" options={{ animation: "none" }} />
      <Stack.Screen name="en-reparacion" options={{ animation: "none" }} />
      <Stack.Screen name="reparados" options={{ animation: "none" }} />
      <Stack.Screen name="entregados" options={{ animation: "none" }} />

      <Stack.Screen
        name="create"
        options={{
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}
