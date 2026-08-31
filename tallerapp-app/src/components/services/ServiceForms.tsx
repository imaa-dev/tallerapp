import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  useColorScheme,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Colors } from "@/constants/theme";
import { useModal } from "@/context/ModalContextForm";
import { useToast } from "@/context/ToastContext";
import { useQueryClient } from "@tanstack/react-query";
import AppTextInput from "@/components/ui/AppTextInput";
import AppButton from "@/components/ui/AppButton";
import AppSectionTitle from "@/components/ui/AppSectionTitle";
import {
  updateDiagnosisRequest,
  approveSparePartsRequest,
  approveCostRequest,
  startRepairRequest,
  completeRepairRequest,
  deliverServiceRequest,
} from "@/services/services/service-status.service";
import { ServiceRecord } from "@/types/servi/servi.type";

interface FormProps {
  service: ServiceRecord;
}

export function DiagnosisForm({ service }: FormProps) {
  const scheme = useColorScheme() ?? "dark";
  const colors = Colors[scheme];
  const { closeModal } = useModal();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      issues: [{ issue: "", cost: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "issues" });

  const onSubmit = async (data: { issues: { issue: string; cost: string }[] }) => {
    try {
      setLoading(true);
      const formatted = data.issues.map((i) => ({
        issue: i.issue,
        cost: parseFloat(i.cost) || 0,
      }));
      await updateDiagnosisRequest(service.id, formatted);
      await queryClient.invalidateQueries({ queryKey: ["services"] });
      showToast("success", "Diagnostico", "Diagnostico guardado correctamente");
      closeModal();
    } catch {
      showToast("error", "Error", "No se pudo guardar el diagnostico");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ maxHeight: 500 }}>
      <AppSectionTitle>Diagnostico - Servicio #{service.id}</AppSectionTitle>
      {fields.map((field, index) => (
        <View key={field.id} style={styles.issueRow}>
          <View style={{ flex: 2 }}>
            <Controller
              control={control}
              name={`issues.${index}.issue`}
              rules={{ required: "Requerido" }}
              render={({ field: { value, onChange } }) => (
                <AppTextInput label={`Diagnostico ${index + 1}`} value={value} onChangeText={onChange} />
              )}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Controller
              control={control}
              name={`issues.${index}.cost`}
              rules={{ required: "Requerido" }}
              render={({ field: { value, onChange } }) => (
                <AppTextInput label="Costo" value={value} onChangeText={onChange} keyboardType="numeric" />
              )}
            />
          </View>
          {fields.length > 1 && (
            <Pressable onPress={() => remove(index)} style={styles.removeBtn}>
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </Pressable>
          )}
        </View>
      ))}
      <AppButton
        title="Agregar otro"
        variant="outline"
        onPress={() => append({ issue: "", cost: "" })}
        icon={<Ionicons name="add" size={18} color={colors.primary} />}
        style={{ marginBottom: 12 }}
      />
      <AppButton
        title="Guardar diagnostico"
        variant="contrast"
        onPress={handleSubmit(onSubmit)}
        loading={loading}
        icon={<Ionicons name="checkmark-circle" size={20} color={colors.background} />}
      />
    </ScrollView>
  );
}

export function SparePartsApprovalForm({ service }: FormProps) {
  const scheme = useColorScheme() ?? "dark";
  const colors = Colors[scheme];
  const { closeModal } = useModal();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const spareParts = service.spareparts ?? [];

  const handleApprove = async () => {
    try {
      setLoading(true);
      await approveSparePartsRequest(service.id);
      await queryClient.invalidateQueries({ queryKey: ["services"] });
      showToast("success", "Repuestos", "Repuestos aprobados");
      closeModal();
    } catch {
      showToast("error", "Error", "No se pudieron aprobar los repuestos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ maxHeight: 500 }}>
      <AppSectionTitle>Aprobacion de repuestos - #{service.id}</AppSectionTitle>
      {spareParts.length > 0 ? (
        spareParts.map((sp: any) => (
          <View key={sp.id} style={[styles.spareItem, { borderBottomColor: colors.border }]}>
            <Text style={{ color: colors.text, fontWeight: "600" }}>
              {sp.brand} {sp.model}
            </Text>
            <Text style={{ color: colors.primary, fontWeight: "bold" }}>
              ${sp.price?.toLocaleString() ?? 0}
            </Text>
          </View>
        ))
      ) : (
        <Text style={{ color: colors.subtitle, marginBottom: 12 }}>
          No hay repuestos registrados para este servicio.
        </Text>
      )}
      <AppButton
        title="Aprobar repuestos"
        variant="contrast"
        onPress={handleApprove}
        loading={loading}
        icon={<Ionicons name="checkmark-circle" size={20} color={colors.background} />}
      />
    </ScrollView>
  );
}

export function CostApprovalForm({ service }: FormProps) {
  const scheme = useColorScheme() ?? "dark";
  const colors = Colors[scheme];
  const { closeModal } = useModal();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const totalDiagnosis = service.service_issues?.reduce((sum: number, i: any) => sum + (i.cost ?? 0), 0) ?? 0;

  const handleApprove = async (method: string) => {
    try {
      setLoading(true);
      await approveCostRequest(service.id, method);
      await queryClient.invalidateQueries({ queryKey: ["services"] });
      showToast("success", "Costos", "Aprobacion de costos enviada");
      closeModal();
    } catch {
      showToast("error", "Error", "No se pudo aprobar el costo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ maxHeight: 500 }}>
      <AppSectionTitle>Aprobacion de costos - #{service.id}</AppSectionTitle>
      <View style={[styles.totalRow, { borderColor: colors.border }]}>
        <Text style={{ color: colors.text, fontWeight: "600" }}>Total diagnostico:</Text>
        <Text style={{ color: colors.primary, fontWeight: "bold", fontSize: 18 }}>
          ${totalDiagnosis.toLocaleString()}
        </Text>
      </View>
      <Text style={{ color: colors.subtitle, fontSize: 13, marginBottom: 16 }}>
        Selecciona como enviar la solicitud al cliente:
      </Text>
      <AppButton
        title="Verbal (presencial)"
        variant="outline"
        onPress={() => handleApprove("verbal")}
        loading={loading}
        icon={<Ionicons name="person" size={18} color={colors.primary} />}
        style={{ marginBottom: 8 }}
      />
      <AppButton
        title="Por WhatsApp"
        variant="outline"
        onPress={() => handleApprove("whatsapp")}
        loading={loading}
        icon={<Ionicons name="logo-whatsapp" size={18} color="#25D366" />}
        style={{ marginBottom: 8 }}
      />
      <AppButton
        title="Por Email"
        variant="outline"
        onPress={() => handleApprove("email")}
        loading={loading}
        icon={<Ionicons name="mail" size={18} color={colors.primary} />}
      />
    </ScrollView>
  );
}

export function RepairForm({ service }: FormProps) {
  const scheme = useColorScheme() ?? "dark";
  const colors = Colors[scheme];
  const { closeModal } = useModal();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm({
    defaultValues: { repair_price: "", final_note: "" },
  });

  const onStartRepair = async () => {
    try {
      setLoading(true);
      await startRepairRequest(service.id);
      await queryClient.invalidateQueries({ queryKey: ["services"] });
      showToast("success", "Reparacion", "Reparacion iniciada");
      closeModal();
    } catch {
      showToast("error", "Error", "No se pudo iniciar la reparacion");
    } finally {
      setLoading(false);
    }
  };

  const onCompleteRepair = async (data: { repair_price: string; final_note: string }) => {
    try {
      setLoading(true);
      await completeRepairRequest(service.id, {
        repair_price: parseFloat(data.repair_price) || 0,
        final_note: data.final_note,
      });
      await queryClient.invalidateQueries({ queryKey: ["services"] });
      showToast("success", "Reparacion", "Reparacion completada");
      closeModal();
    } catch {
      showToast("error", "Error", "No se pudo completar la reparacion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ maxHeight: 500 }}>
      <AppSectionTitle>Reparacion - #{service.id}</AppSectionTitle>
      <AppButton
        title="Iniciar reparacion"
        variant="outline"
        onPress={onStartRepair}
        loading={loading}
        icon={<Ionicons name="play-circle" size={18} color={colors.primary} />}
        style={{ marginBottom: 16 }}
      />
      <AppSectionTitle>Completar reparacion</AppSectionTitle>
      <Controller
        control={control}
        name="repair_price"
        rules={{ required: "Requerido" }}
        render={({ field: { value, onChange } }) => (
          <AppTextInput label="Precio de reparacion" value={value} onChangeText={onChange} keyboardType="numeric" />
        )}
      />
      <Controller
        control={control}
        name="final_note"
        rules={{ required: "Requerido" }}
        render={({ field: { value, onChange } }) => (
          <AppTextInput label="Nota final" value={value} onChangeText={onChange} multiline />
        )}
      />
      <AppButton
        title="Completar reparacion"
        variant="contrast"
        onPress={handleSubmit(onCompleteRepair)}
        loading={loading}
        icon={<Ionicons name="checkmark-circle" size={20} color={colors.background} />}
      />
    </ScrollView>
  );
}

export function DeliveredForm({ service }: FormProps) {
  const scheme = useColorScheme() ?? "dark";
  const colors = Colors[scheme];
  const { closeModal } = useModal();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const handleDeliver = async () => {
    try {
      setLoading(true);
      await deliverServiceRequest(service.id);
      await queryClient.invalidateQueries({ queryKey: ["services"] });
      showToast("success", "Entrega", "Servicio entregado");
      closeModal();
    } catch {
      showToast("error", "Error", "No se pudo entregar el servicio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ maxHeight: 500 }}>
      <AppSectionTitle>Entregar servicio - #{service.id}</AppSectionTitle>
      <Text style={{ color: colors.subtitle, marginBottom: 16 }}>
        Confirma la entrega del servicio al cliente.
      </Text>
      <AppButton
        title="Marcar como entregado"
        variant="contrast"
        onPress={handleDeliver}
        loading={loading}
        icon={<Ionicons name="checkmark-done-circle" size={20} color={colors.background} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  issueRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 4,
  },
  removeBtn: {
    marginTop: 30,
    padding: 8,
  },
  spareItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
});
