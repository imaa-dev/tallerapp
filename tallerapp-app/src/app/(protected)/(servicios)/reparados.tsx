import ServiceStatusList from "@/components/services/ServiceStatusList";

export default function Reparados() {
  return (
    <ServiceStatusList
      statusId={6}
      statusColor="#22C55E"
      statusLabel="Reparado"
    />
  );
}
