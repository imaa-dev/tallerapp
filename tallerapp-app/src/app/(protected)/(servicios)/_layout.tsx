import { Tabs } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { MaterialIcons } from '@expo/vector-icons';


export default function DashboardTabs() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Crear servicio",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          )
        }}
      />

      <Tabs.Screen
        name="recepcionados"
        options={{
          title: "Recepcion",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="alert" size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="diagnosticados"
        options={{
          title: "Diagnosticos",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="suitcase-medical" size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="repuestos"
        options={{
          title: "Repuestos",
          tabBarIcon: ( { color, size }) => (
            <AntDesign name="code-sandbox" size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="reparaciones"
        options={{
          title: "Reparacion",
          tabBarIcon: ( { color, size }) => (
            <AntDesign name="tool" size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="reparados"
        options={{
          title: "Reparados",
          tabBarIcon: ( {color, size} ) => (
            <MaterialIcons name="task-alt" size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="entregados"
        options={{
          title: "Entregados",
          tabBarIcon: ( { color, size }) => (
            <MaterialIcons name="handshake" size={size} color={color} />
          )
        }}
      />
    </Tabs>
  );
}