import { View, ScrollView, StyleSheet, useColorScheme, Text } from "react-native";
import { useSubscription } from "@/hooks/useSubscription";
import { Colors } from "@/constants/theme";
import AppLoading from "@/components/ui/AppLoading";
import AppEmptyState from "@/components/ui/AppEmptyState";
import AppCard from "@/components/ui/AppCard";
import AppSectionTitle from "@/components/ui/AppSectionTitle";
import AppPageTitle from "@/components/ui/AppPageTitle";
import { Ionicons } from "@expo/vector-icons";

export default function SubscriptionScreen() {
  const { data, isLoading, isError } = useSubscription();
  const scheme = useColorScheme() ?? "dark";
  const colors = Colors[scheme];

  if (isLoading) return <AppLoading message="Cargando suscripcion..." />;
  if (isError || !data) {
    return (
      <AppEmptyState
        icon="alert-circle-outline"
        title="Error"
        description="No se pudo cargar la suscripcion."
      />
    );
  }

  const statusColors: Record<string, string> = {
    trial: "#3B82F6",
    active: "#22C55E",
    expired: "#EF4444",
    pending: "#F97316",
    cancelled: "#6B7280",
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppPageTitle
        title="Suscripcion"
        icon={<Ionicons name="card-outline" size={20} color={colors.text} />}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <AppCard>
          <AppSectionTitle>Estado actual</AppSectionTitle>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusColors[data.status] ?? "#6B7280" },
              ]}
            >
              <Text style={styles.statusText}>{data.status.toUpperCase()}</Text>
            </View>
          </View>

          <View style={styles.datesRow}>
            <View style={styles.dateBox}>
              <Text style={[styles.dateLabel, { color: colors.subtitle }]}>Inicio</Text>
              <Text style={[styles.dateValue, { color: colors.text }]}>
                {new Date(data.starts_at).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.dateBox}>
              <Text style={[styles.dateLabel, { color: colors.subtitle }]}>Fin</Text>
              <Text style={[styles.dateValue, { color: colors.text }]}>
                {new Date(data.ends_at).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </AppCard>

        {data.plan && (
          <AppCard>
            <AppSectionTitle>Plan: {data.plan.name}</AppSectionTitle>
            <Text style={[styles.planPrice, { color: colors.primary }]}>
              ${data.plan.price.toLocaleString()} / {data.plan.duration_months} meses
            </Text>
            {data.plan.plan_features?.map((f) => (
              <View key={f.id} style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={16} color="#22C55E" />
                <Text style={[styles.featureText, { color: colors.text }]}>{f.name}</Text>
              </View>
            ))}
          </AppCard>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  statusRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 13,
  },
  datesRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 16,
  },
  dateBox: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
  },
  dateValue: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 2,
  },
  planPrice: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  featureText: {
    fontSize: 14,
  },
});
