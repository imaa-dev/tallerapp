import React, { useMemo } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { usePathname, useRouter } from "expo-router";
import { Colors } from "@/constants/theme";
import { useCountTypeServices } from "@/hooks/countTypeServices";
import { ServiceType } from "@/types/servi/servi.type";

type ServiceStatusSlug = Exclude<ServiceType["slug"], "incidencias">;

type ServiceStatusTab = {
  slug: ServiceStatusSlug;
  label: string;
  href:
    | "/recepcionados"
    | "/diagnosticados"
    | "/repuestos"
    | "/aprobacion-costos"
    | "/en-reparacion"
    | "/reparados"
    | "/entregados";
  color: string;
};

const SERVICE_STATUS_TABS: ServiceStatusTab[] = [
  {
    slug: "recepcionados",
    label: "Recepción",
    href: "/recepcionados",
    color: "#3B82F6",
  },
  {
    slug: "diagnosticados",
    label: "Diagnóstico",
    href: "/diagnosticados",
    color: "#8B5CF6",
  },
  {
    slug: "repuestos",
    label: "Repuestos",
    href: "/repuestos",
    color: "#F97316",
  },
  {
    slug: "aprobacion-costos",
    label: "Aprobación",
    href: "/aprobacion-costos",
    color: "#14B8A6",
  },
  {
    slug: "en-reparacion",
    label: "En reparación",
    href: "/en-reparacion",
    color: "#6B7280",
  },
  {
    slug: "reparados",
    label: "Reparados",
    href: "/reparados",
    color: "#22C55E",
  },
  {
    slug: "entregados",
    label: "Entregados",
    href: "/entregados",
    color: "#10B981",
  },
];

export default function ServiceStatusTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const scheme = useColorScheme() ?? "dark";
  const colors = Colors[scheme];
  const { data: serviceTypes = [] } = useCountTypeServices();

  const counts = useMemo(() => {
    return new Map(serviceTypes.map((service) => [service.slug, service.count]));
  }, [serviceTypes]);

  const currentSlug = pathname.split("/").filter(Boolean).at(-1);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {SERVICE_STATUS_TABS.map((tab) => {
          const isActive = currentSlug === tab.slug;
          const count = counts.get(tab.slug) ?? 0;

          return (
            <Pressable
              key={tab.slug}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`${tab.label}, ${count} servicios`}
              onPress={() => {
                if (!isActive) {
                  // replace evita construir un historial enorme al cambiar de estado.
                  router.replace(tab.href);
                }
              }}
              style={({ pressed }) => [
                styles.tab,
                pressed && styles.tabPressed,
              ]}
            >
              <View style={styles.labelRow}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.label,
                    {
                      color: isActive ? colors.primary : colors.subtitle,
                    },
                    isActive && styles.activeLabel,
                  ]}
                >
                  {tab.label}
                </Text>

                {count > 0 && (
                  <View
                    style={[
                      styles.countBadge,
                      {
                        backgroundColor: isActive ? tab.color : colors.background,
                        borderColor: isActive ? tab.color : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.countText,
                        {
                          color: isActive ? "#FFFFFF" : colors.subtitle,
                        },
                      ]}
                    >
                      {count}
                    </Text>
                  </View>
                )}
              </View>

              <View
                style={[
                  styles.indicator,
                  {
                    backgroundColor: isActive ? colors.primary : "transparent",
                  },
                ]}
              />
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
  tab: {
    minHeight: 52,
    justifyContent: "flex-end",
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  tabPressed: {
    opacity: 0.7,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingBottom: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
  },
  activeLabel: {
    fontWeight: "700",
  },
  countBadge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  countText: {
    fontSize: 11,
    fontWeight: "700",
  },
  indicator: {
    height: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});
