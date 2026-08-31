import { useState } from "react";
import { View, FlatList, Text, StyleSheet, useColorScheme } from "react-native";
import { useUsers } from "@/hooks/useUsers";
import { Colors } from "@/constants/theme";
import AppLoading from "@/components/ui/AppLoading";
import AppEmptyState from "@/components/ui/AppEmptyState";
import AppPageTitle from "@/components/ui/AppPageTitle";
import AppCard from "@/components/ui/AppCard";
import AppFilterBar, { FilterField } from "@/components/ui/AppFilterBar";
import AppPaginationBar from "@/components/ui/AppPaginationBar";
import { Ionicons } from "@expo/vector-icons";
import { UserListItem } from "@/types/user/user-list.type";

const FILTERS: FilterField[] = [
  { key: "search", label: "Nombre", placeholder: "Buscar por nombre..." },
  { key: "email", label: "Email", placeholder: "Buscar por email..." },
];

export default function UsersScreen() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const { data, isLoading, isError } = useUsers({ ...filters, page, per_page: 15 });
  const scheme = useColorScheme() ?? "dark";
  const colors = Colors[scheme];

  if (isLoading && !data) return <AppLoading message="Cargando usuarios..." />;
  if (isError || !data) {
    return (
      <AppEmptyState icon="alert-circle-outline" title="Error" description="No se pudieron cargar los usuarios." />
    );
  }

  const renderItem = ({ item }: { item: UserListItem }) => (
    <AppCard>
      <View style={styles.row}>
        <Ionicons
          name={item.rol === "ADMIN" ? "shield-checkmark-outline" : "person-outline"}
          size={24}
          color={colors.primary}
        />
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.email, { color: colors.subtitle }]}>{item.email}</Text>
          <Text style={[styles.rol, { color: colors.primary }]}>{item.rol}</Text>
        </View>
      </View>
    </AppCard>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppPageTitle title="Usuarios" icon={<Ionicons name="people-outline" size={20} color={colors.text} />} />
      <AppFilterBar
        fields={FILTERS}
        values={filters}
        onChange={(k, v) => setFilters((p) => ({ ...p, [k]: v }))}
        onSearch={() => { setPage(1); }}
        onClear={() => { setFilters({}); setPage(1); }}
      />
      <FlatList
        data={data.users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<AppEmptyState icon="people-outline" title="Sin usuarios" description="No hay usuarios." />}
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
  email: { fontSize: 13, marginTop: 2 },
  rol: { fontSize: 12, fontWeight: "600", marginTop: 4, textTransform: "uppercase" },
});
