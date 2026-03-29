import { Tabs } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { MaterialIcons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/authContext";
import { getTypeService } from "@/services/services/service.service";

export default function DashboardTabs() {
  const [services, setServices] = useState();

  const { organizationId } = useContext(AuthContext)
  useEffect(() =>{ 
      getTypeServices(organizationId)

  }, [])
  const getTypeServices = async (organization_id) => {
    const response = await getTypeService(organization_id)
    setServices(response.countTypeService)
  }

  const getIcon = (slug: string, color: string, size: number) => {
  switch (slug) {
    case "recepcionados":
      return <AntDesign name="alert" size={size} color={color} />;

    case "diagnosticados":
      return <FontAwesome6 name="suitcase-medical" size={size} color={color} />;

    case "repuestos":
      return <AntDesign name="code-sandbox" size={size} color={color} />;

    case "en-reparacion":
      return <AntDesign name="tool" size={size} color={color} />;
    case "reparados":
      return <FontAwesome6 name="list-check" size={24} color="black" />;

    case "entregados":
      return <MaterialIcons name="task-alt" size={size} color={color} />;

    default:
      return <Ionicons name="ellipse-outline" size={size} color={color} />;
  }
};
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

      {services?.map((item) => (
        
      <Tabs.Screen
        key={item.slug}
        name={item.slug}
        options={{
          title: item.label,
          tabBarBadge: item.count > 0 ? item.count : undefined,
          tabBarIcon: ({ color, size }) =>
            getIcon(item.slug, color, size)
        }}
      />
    ))}
    </Tabs>
  );
}