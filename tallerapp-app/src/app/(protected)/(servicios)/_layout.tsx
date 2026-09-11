import { Tabs } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';
import {serviceConfig} from "@/types/servi/servi.type";
import {useCountTypeServices} from "@/hooks/countTypeServices";

export default function DashboardTabs() {
  const scheme = useColorScheme() ?? 'dark';
  const colors = Colors[scheme];
  const queryCountTypeServices = useCountTypeServices();
  const serviceTypes = queryCountTypeServices.data ?? [];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerTintColor: colors.text,

        sceneStyle: {
          backgroundColor: colors.background,
        },

        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },

        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtitle,
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

        {serviceTypes?.map((service) => {
            const config = serviceConfig[service.slug];

            if (!config) {
                console.warn(
                    `Servicio sin configuración: ${service.slug}`
                );
                return null;
            }

            const Icon = config.icon;

            return (
                <Tabs.Screen
                    key={service.slug}
                    name={service.slug}
                    options={{
                        title: service.label,
                        tabBarBadge: service.count || undefined,
                        tabBarBadgeStyle: {
                            backgroundColor: service.color,
                        },
                        tabBarIcon: ({ color, size }) => (
                            <Icon
                                color={color}
                                size={size}
                            />
                        ),
                    }}
                />
            );
        })}
    </Tabs>
  );
}