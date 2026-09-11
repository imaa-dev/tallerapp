import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useGetServices } from "@/hooks/useGetServices";
import RecepcionadosList from "@/components/services/RecepcionadosList";
import ServiceStatusScaffold from "@/components/services/ServiceStatusScaffold";

export default function RecepcionadosScreen() {
  const serviceQuery = useGetServices();
  const services = serviceQuery.data ?? [];

  let content;

  if (serviceQuery.isLoading) {
    content = (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else if (serviceQuery.isError) {
    content = (
      <View style={styles.center}>
        <Text>Error cargando servicios</Text>
      </View>
    );
  } else {
    content = (
      <View style={styles.container}>
        <RecepcionadosList services={services} />
      </View>
    );
  }

  return <ServiceStatusScaffold>{content}</ServiceStatusScaffold>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
