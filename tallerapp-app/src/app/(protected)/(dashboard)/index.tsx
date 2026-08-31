import { ScrollView, View, Text, StyleSheet, useColorScheme } from "react-native";
import { useDashboard } from "@/hooks/useDashboard";
import { Colors } from "@/constants/theme";
import AppLoading from "@/components/ui/AppLoading";
import AppEmptyState from "@/components/ui/AppEmptyState";
import AppCard from "@/components/ui/AppCard";
import AppSectionTitle from "@/components/ui/AppSectionTitle";
import AppPageTitle from "@/components/ui/AppPageTitle";
import { Ionicons } from "@expo/vector-icons";

export default function DashboardScreen() {
  const { data, isLoading, isError } = useDashboard();
  const scheme = useColorScheme() ?? "dark";
  const colors = Colors[scheme];

  if (isLoading) return <AppLoading message="Cargando dashboard..." />;
  if (isError || !data) {
    return (
      <AppEmptyState
        icon="alert-circle-outline"
        title="Error"
        description="No se pudo cargar el dashboard."
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppPageTitle
        title="Panel Central"
        icon={<Ionicons name="grid-outline" size={20} color={colors.text} />}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <AppCard>
          <AppSectionTitle>Servicios</AppSectionTitle>
          <View style={styles.statsRow}>
            <StatBox label="Total" value={data.services.total} color={colors.text} />
            <StatBox label="Activos" value={data.services.active} color="#3B82F6" />
          </View>
          <View style={styles.statusGrid}>
            {data.services.status.map((s) => (
              <View key={s.slug} style={[styles.statusItem, { borderLeftColor: s.color }]}>
                <Text style={[styles.statusLabel, { color: colors.subtitle }]}>{s.label}</Text>
                <Text style={[styles.statusCount, { color: colors.text }]}>{s.count}</Text>
              </View>
            ))}
          </View>
        </AppCard>

        <AppCard>
          <AppSectionTitle>Clientes</AppSectionTitle>
          <View style={styles.statsRow}>
            <StatBox label="Total" value={data.clients.total} color={colors.text} />
            <StatBox label="Nuevos" value={data.clients.new_this_month} color="#22C55E" />
            <StatBox label="Recurrentes" value={data.clients.recurring} color="#8B5CF6" />
          </View>
        </AppCard>

        <AppCard>
          <AppSectionTitle>Negocio</AppSectionTitle>
          <View style={styles.statsRow}>
            <StatBox
              label="Ingresos"
              value={`$${data.business.revenue_this_month.toLocaleString()}`}
              color="#22C55E"
            />
            <StatBox
              label="Ticket prom."
              value={`$${data.business.avg_ticket.toLocaleString()}`}
              color="#F97316"
            />
          </View>
        </AppCard>

        <AppCard>
          <AppSectionTitle>Resumen</AppSectionTitle>
          <View style={styles.statsRow}>
            <StatBox label="Productos" value={data.counts.products} color={colors.text} />
            <StatBox label="Repuestos" value={data.counts.others} color={colors.text} />
            <StatBox label="Reparación" value={data.counts.services_reparaciones} color={colors.text} />
          </View>
        </AppCard>
      </ScrollView>
    </View>
  );
}

function StatBox({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
  statusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  statusItem: {
    width: "48%",
    borderLeftWidth: 3,
    paddingLeft: 8,
    paddingVertical: 6,
  },
  statusLabel: {
    fontSize: 12,
  },
  statusCount: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
