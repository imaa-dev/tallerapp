import { useRouter } from "expo-router";
import { ServiceRecord } from "@/types/servi/servi.type";
import { ActionBottomSheet, ServiceAction } from "@/components/services/ActionBottomSheet";
import {
  DiagnosisForm,
  SparePartsApprovalForm,
  CostApprovalForm,
  RepairForm,
  DeliveredForm,
} from "@/components/services/ServiceForms";

interface Props {
  service: ServiceRecord;
  handleDelete: () => void;
  onAction?: (action: string) => void;
}

export function ServiceActions({ service, handleDelete, onAction }: Props) {
  const router = useRouter();
  const actions: ServiceAction[] = [];

  actions.push({
    title: "Editar",
    icon: "edit",
    onPress: (s) => router.push(`/service/${s.id}/edit`),
  });

  if (service.status_id === 2) {
    actions.push({
      title: "Diagnosticar",
      icon: "build",
      onPress: () => onAction?.("diagnosis"),
    });
  }

  if (service.status_id === 3) {
    actions.push({
      title: "Aprobar repuestos",
      icon: "check-circle",
      onPress: () => onAction?.("spare-parts"),
    });
  }

  if (service.status_id === 4) {
    actions.push({
      title: "Aprobar costos",
      icon: "attach-money",
      onPress: () => onAction?.("cost"),
    });
  }

  if (service.status_id === 5) {
    actions.push({
      title: "Reparar / Completar",
      icon: "handyman",
      onPress: () => onAction?.("repair"),
    });
  }

  if (service.status_id === 6) {
    actions.push({
      title: "Entregar",
      icon: "check-done",
      onPress: () => onAction?.("delivered"),
    });
  }

  actions.push({
    title: "Eliminar",
    icon: "delete",
    danger: true,
    onPress: () => handleDelete(),
  });

  return <ActionBottomSheet service={service} actions={actions} />;
}
