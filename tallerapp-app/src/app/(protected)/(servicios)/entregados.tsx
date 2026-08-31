import ServiceStatusList from "@/components/services/ServiceStatusList";

export default function Entregados() {
  return (
    <ServiceStatusList
      statusId={7}
      statusColor="#10B981"
      statusLabel="Entregado"
    />
  );
}
