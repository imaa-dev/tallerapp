import { useState } from "react";
import { View, FlatList, Text, StyleSheet, useColorScheme } from "react-native";
import { useDocuments } from "@/hooks/useDocuments";
import { Colors } from "@/constants/theme";
import AppLoading from "@/components/ui/AppLoading";
import AppEmptyState from "@/components/ui/AppEmptyState";
import AppPageTitle from "@/components/ui/AppPageTitle";
import AppCard from "@/components/ui/AppCard";
import AppFilterBar, { FilterField } from "@/components/ui/AppFilterBar";
import AppPaginationBar from "@/components/ui/AppPaginationBar";
import { Ionicons } from "@expo/vector-icons";
import { RepairDocument } from "@/types/document/document.type";

const FILTERS: FilterField[] = [
  { key: "search", label: "Buscar", placeholder: "Numero o tipo..." },
];

export default function DocumentsScreen() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const { data, isLoading, isError } = useDocuments({ ...filters, page, per_page: 15 });
  const scheme = useColorScheme() ?? "dark";
  const colors = Colors[scheme];

  if (isLoading && !data) return <AppLoading message="Cargando documentos..." />;
  if (isError || !data) {
    return (
      <AppEmptyState icon="alert-circle-outline" title="Error" description="No se pudieron cargar los documentos." />
    );
  }

  const renderItem = ({ item }: { item: RepairDocument }) => (
    <AppCard>
      <View style={styles.row}>
        <Ionicons name="document-text-outline" size={24} color={colors.primary} />
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]}>
            {item.type} #{item.number}
          </Text>
          <Text style={[styles.date, { color: colors.subtitle }]}>{item.date}</Text>
          <Text style={[styles.status, { color: colors.primary }]}>{item.status}</Text>
        </View>
        <Text style={[styles.amount, { color: colors.text }]}>
          {item.amount != null ? `$${item.amount.toLocaleString()}` : "-"}
        </Text>
      </View>
    </AppCard>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppPageTitle title="Documentos" icon={<Ionicons name="documents-outline" size={20} color={colors.text} />} />
      <AppFilterBar
        fields={FILTERS}
        values={filters}
        onChange={(k, v) => setFilters((p) => ({ ...p, [k]: v }))}
        onSearch={() => { setPage(1); }}
        onClear={() => { setFilters({}); setPage(1); }}
      />
      <FlatList
        data={data.documents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<AppEmptyState icon="documents-outline" title="Sin documentos" description="No hay documentos." />}
      />
      {data.pagination && (
        <AppPaginationBar
          currentPage={data.pagination.current_page}
          lastPage={data.pagination.last_page}
          total={data.pagination.total}
          onPageChange={setPage}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 12 },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "600" },
  date: { fontSize: 12, marginTop: 2 },
  status: { fontSize: 12, fontWeight: "600", marginTop: 4 },
  amount: { fontSize: 16, fontWeight: "bold" },
});
