import { useRouter } from "expo-router";
import { ServiceRecord } from "@/types/servi/servi.type";
import { ActionBottomSheet, ServiceAction } from "@/components/services/ActionBottomSheet";
import { useModal } from "@/context/ModalContextForm";
import {
  ToDiagnosisForm,
  GoBackForm,
  DiagnosisForm,
  ToCostApprovalTransitionForm,
  CostApprovalForm,
  RepairForm,
  DeliveredForm,
} from "@/components/services/ServiceForms";
import { AddSparePartsForm } from "@/components/services/AddSparePartsForm";

interface Props {
  service: ServiceRecord;
  handleDelete: () => void;
}

export function ServiceActions({ service, handleDelete }: Props) {
  const router = useRouter();
  const { openModal } = useModal();
  const actions: ServiceAction[] = [];

  actions.push({
    title: "Editar",
    icon: "edit",
    onPress: () => router.push(`/service/${service.id}/edit`),
  });

  if (service.status_id === 1) {
    actions.push({
      title: "A Taller",
      icon: "factory",
      onPress: () => openModal(<ToDiagnosisForm service={service} />),
    });
  }

  if (service.status_id === 2) {
    actions.push({
      title: "Diagnosticar",
      icon: "build",
      onPress: () => openModal(<DiagnosisForm service={service} />),
    });
  }

  if (service.status_id === 3) {
    actions.push({
      title: "Agregar repuestos",
      icon: "inventory",
      onPress: () => openModal(<AddSparePartsForm service={service} />),
    });
    actions.push({
      title: "Enviar a aprobación de costos",
      icon: "payments",
      onPress: () => openModal(<ToCostApprovalTransitionForm service={service} />),
    });
  }

  if (service.status_id === 4) {
    actions.push({
      title: "Aprobar costos",
      icon: "attach-money",
      onPress: () => openModal(<CostApprovalForm service={service} />),
    });
  }

  if (service.status_id === 5) {
    actions.push({
      title: "Reparar / Completar",
      icon: "handyman",
      onPress: () => openModal(<RepairForm service={service} />),
    });
  }

  if (service.status_id === 6) {
    actions.push({
      title: "Entregar",
      icon: "done-all",
      onPress: () => openModal(<DeliveredForm service={service} />),
    });
  }

  if (service.status_id !== 1) {
    actions.push({
      title: "Regresar",
      icon: "undo",
      onPress: () => openModal(<GoBackForm service={service} />),
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