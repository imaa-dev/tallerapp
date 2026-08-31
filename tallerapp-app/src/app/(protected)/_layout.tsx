import { AuthContext } from "@/context/authContext";
import { Redirect } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useContext } from "react";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";

export default function ProtectedLayout() {
  const { token } = useContext(AuthContext);
  const scheme = useColorScheme() ?? "dark";
  const colors = Colors[scheme];

  if (!token) {
    return <Redirect href="/login" />;
  }

  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        sceneStyle: { backgroundColor: colors.background },
        drawerStyle: { backgroundColor: colors.surface },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.text,
      }}
    >
      <Drawer.Screen
        name="(dashboard)"
        options={{
          drawerLabel: "Panel central",
          title: "Panel central",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="(servicios)"
        options={{
          drawerLabel: "Servicios",
          title: "Servicios",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="build-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="(products)"
        options={{
          drawerLabel: "Productos",
          title: "Productos",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="pricetags-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="(organization)"
        options={{
          drawerLabel: "Organizacion",
          title: "Organizacion",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="business-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="(users)"
        options={{
          drawerLabel: "Usuarios",
          title: "Usuarios",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="(spare-parts)"
        options={{
          drawerLabel: "Repuestos",
          title: "Repuestos",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="cube-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="(documents)"
        options={{
          drawerLabel: "Documentos",
          title: "Documentos",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="documents-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="(subscriptions)"
        options={{
          drawerLabel: "Suscripciones",
          title: "Suscripciones",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="card-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="(settings)"
        options={{
          drawerLabel: "Configuracion",
          title: "Configuracion",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
