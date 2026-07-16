import { AuthContext } from "@/context/authContext";
import { Redirect } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useContext } from "react";
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

export default function ProtectedLayout() {
  const { token } = useContext(AuthContext)
  const scheme = useColorScheme() ?? 'dark';
  const colors = Colors[scheme];
  if(!token){
    return <Redirect href="/login"/>
  }
  return (
    <Drawer 
      screenOptions={{ 
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        sceneStyle: {
          backgroundColor: colors.background,
        },

        drawerStyle: {
          backgroundColor: colors.surface,
        },

        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.text,
      
      }}
    
    >
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