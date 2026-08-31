import { useState } from "react";
import { View, FlatList, Text, StyleSheet, useColorScheme } from "react-native";
import { useSpareParts } from "@/hooks/useSpareParts";
import { Colors } from "@/constants/theme";
import AppLoading from "@/components/ui/AppLoading";
import AppEmptyState from "@/components/ui/AppEmptyState";
import AppPageTitle from "@/components/ui/AppPageTitle";
import AppCard from "@/components/ui/AppCard";
import AppFilterBar, { FilterField } from "@/components/ui/AppFilterBar";
import AppPaginationBar from "@/components/ui/AppPaginationBar";
import { Ionicons } from "@expo/vector-icons";
import { SparePart } from "@/types/spare-part/spare-part.type";

const FILTERS: FilterField[] = [
  { key: "search", label: "Buscar", placeholder: "Modelo o marca..." },
  { key: "brand", label: "Marca", placeholder: "Filtrar por marca..." },
];

export default function SparePartsScreen() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const { data, isLoading, isError } = useSpareParts({ ...filters, page, per_page: 15 });
  const scheme = useColorScheme() ?? "dark";
  const colors = Colors[scheme];

  if (isLoading && !data) return <AppLoading message="Cargando repuestos..." />;
  if (isError || !data) {
    return (
      <AppEmptyState icon="alert-circle-outline" title="Error" description="No se pudieron cargar los repuestos." />
    );
  }

  const renderItem = ({ item }: { item: SparePart }) => (
    <AppCard>
      <View style={styles.row}>
        <Ionicons name="cube-outline" size={24} color={colors.primary} />
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]}>
            {item.brand} {item.model}
          </Text>
          <Text style={[styles.price, { color: colors.primary }]}>
            ${item.price.toLocaleString()}
          </Text>
          {item.note ? <Text style={[styles.note, { color: colors.subtitle }]}>{item.note}</Text> : null}
        </View>
      </View>
    </AppCard>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppPageTitle title="Repuestos" icon={<Ionicons name="cube-outline" size={20} color={colors.text} />} />
      <AppFilterBar
        fields={FILTERS}
        values={filters}
        onChange={(k, v) => setFilters((p) => ({ ...p, [k]: v }))}
        onSearch={() => { setPage(1); }}
        onClear={() => { setFilters({}); setPage(1); }}
      />
      <FlatList
        data={data.spareParts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<AppEmptyState icon="cube-outline" title="Sin repuestos" description="No hay repuestos." />}
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
  price: { fontSize: 15, fontWeight: "bold", marginTop: 2 },
  note: { fontSize: 12, marginTop: 4 },
});
