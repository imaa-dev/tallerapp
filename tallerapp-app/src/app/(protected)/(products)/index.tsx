import { View, FlatList, Text, StyleSheet, useColorScheme } from "react-native";
import { useState } from "react";
import { useProducts } from "@/hooks/useProduct";
import { Colors } from "@/constants/theme";
import AppLoading from "@/components/ui/AppLoading";
import AppEmptyState from "@/components/ui/AppEmptyState";
import AppPageTitle from "@/components/ui/AppPageTitle";
import AppCard from "@/components/ui/AppCard";
import AppFilterBar, { FilterField } from "@/components/ui/AppFilterBar";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "@/types/product/product.type";

const FILTERS: FilterField[] = [
  { key: "search", label: "Buscar producto", placeholder: "Buscar tipo producto" },
  { key: "brand", label: "Marca", placeholder: "Filtrar por marca..." },
  { key: "model", label: "Modelo", placeholder: "Filtrar por modelo..." },
];

export default function ProductsScreen() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const { data, isLoading, isError } = useProducts(filters);
  const scheme = useColorScheme() ?? "dark";
  const colors = Colors[scheme];

  if (isLoading && !data) return <AppLoading message="Cargando productos..." />;
  if (isError || !data) {
    return (
      <AppEmptyState icon="alert-circle-outline" title="Error" description="No se pudieron cargar los productos." />
    );
  }

  const products = data ?? [];

  const renderItem = ({ item }: { item: Product }) => (
    <AppCard>
      <View style={styles.row}>
        <Ionicons name="pricetag-outline" size={24} color={colors.primary} />
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.detail, { color: colors.subtitle }]}>
            {item.brand} - {item.model}
          </Text>
        </View>
      </View>
    </AppCard>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppPageTitle title="Productos" icon={<Ionicons name="pricetags-outline" size={20} color={colors.text} />} />
      <AppFilterBar
        fields={FILTERS}
        values={filters}
        onChange={(k, v) => setFilters((p) => ({ ...p, [k]: v }))}
        onClear={() => setFilters({})}
      />
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<AppEmptyState icon="pricetag-outline" title="Sin productos" description="No hay productos." />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: { padding: 20, gap: 12 },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "600" },
  detail: { fontSize: 13, marginTop: 2 },
});