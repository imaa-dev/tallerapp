import ServiceStatusList from "@/components/services/ServiceStatusList";

export default function EnReparacion() {
  return (
    <ServiceStatusList
      statusId={5}
      statusColor="#6B7280"
      statusLabel="En reparacion"
    />
  );
}
