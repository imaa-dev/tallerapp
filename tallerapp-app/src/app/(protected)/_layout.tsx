import { AuthContext } from "@/context/authContext";
import { Redirect } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useContext } from "react";

export default function ProtectedLayout() {
  const { token } = useContext(AuthContext)

  if(!token){
    return <Redirect href="/login"/>
  }
  return (
    <Drawer screenOptions={{ headerShown: true }}>
      <Drawer.Screen
        name="(servicios)"
        options={{
          drawerLabel: "servicios",
          title: "Servicios",
        }}
      />

      <Drawer.Screen
        name="(settings)"
        options={{
          drawerLabel: "Configuración",
          title: "Configuración",
        }}
      />
    </Drawer>
  );
}