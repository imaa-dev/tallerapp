import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { useGetServices } from "@/hooks/useGetServices";
import { ServiceCard } from "@/components/services/ServiceCard";
import AppLoading from "@/components/ui/AppLoading";
import AppEmptyState from "@/components/ui/AppEmptyState";
import ServiceStatusScaffold from "@/components/services/ServiceStatusScaffold";

interface Props {
  statusId: number;
  statusColor?: string;
  statusLabel?: string;
}

export default function ServiceStatusList({
  statusId,
  statusColor = "#3B82F6",
  statusLabel = "Servicio",
}: Props) {
  const { data, isLoading, isError } = useGetServices(statusId);

  let content: React.ReactNode;

  if (isLoading) {
    content = <AppLoading message="Cargando servicios..." />;
  } else if (isError) {
    content = (
      <AppEmptyState
        icon="alert-circle-outline"
        title="Error"
        description="No se pudieron cargar los servicios."
      />
    );
  } else {
    const services = data ?? [];

    content = (
      <View style={styles.container}>
        <FlatList
          data={services}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ServiceCard
              service={item}
              statusColor={statusColor}
              statusLabel={statusLabel}
            />
          )}
          ListEmptyComponent={
            <AppEmptyState
              icon="build-outline"
              title="Sin servicios"
              description="No hay servicios en este estado."
            />
          }
        />
      </View>
    );
  }

  return <ServiceStatusScaffold>{content}</ServiceStatusScaffold>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 104,
  },
});
