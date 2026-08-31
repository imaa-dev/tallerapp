import ServiceStatusList from "@/components/services/ServiceStatusList";

export default function Diagnosticados() {
  return (
    <ServiceStatusList
      statusId={2}
      statusColor="#8B5CF6"
      statusLabel="Diagnosticado"
    />
  );
}
