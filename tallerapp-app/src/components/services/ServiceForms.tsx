import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  useColorScheme,
  Alert,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Controller, useForm } from "react-hook-form";
import { Colors } from "@/constants/theme";
import { useModal } from "@/context/ModalContextForm";
import { useToast } from "@/context/ToastContext";
import { useQueryClient } from "@tanstack/react-query";
import AppTextInput from "@/components/ui/AppTextInput";
import AppButton from "@/components/ui/AppButton";
import AppSectionTitle from "@/components/ui/AppSectionTitle";
import AppSelect from "@/components/ui/AppSelect";
import AppPhotoGrid from "@/components/ui/AppPhotoGrid";
import {
  addDiagnosisRequest,
  toSparePartsRequest,
  toCostApprovalRequest,
  uploadServiceImagesRequest,
  deleteServiceImageRequest,
  approveCostRequest,
  startRepairRequest,
  completeRepairRequest,
  deliverServiceRequest,
  toDiagnosisRequest,
  goBackServiceRequest,
} from "@/services/services/service-status.service";
import { ServiceRecord } from "@/types/servi/servi.type";
import { appUrl } from "@/config/env";

interface FormProps {
  service: ServiceRecord;
}

interface ServiceIssueItem {
  id: number;
  servi_id: number;
  issue: string;
  diagnosis: string | null;
  repair_time: string | null;
  cost: number | null;
  attend: boolean;
}

type ServiceFile = {
  id: number;
  path: string;
};

export function DiagnosisForm({ service }: FormProps) {
  const scheme = useColorScheme() ?? "dark";
  const colors = Colors[scheme];
  const { closeModal } = useModal();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [issues, setIssues] = useState<ServiceIssueItem[]>(
    (service.service_issues ?? []) as ServiceIssueItem[]
  );
  const [files, setFiles] = useState<ServiceFile[]>(
    (service.file ?? []).map((f: any) => ({ id: f.id, path: f.path }))
  );
  const [selectedIssue, setSelectedIssue] = useState<{ label: string; value: number | string } | null>(null);
  const [editingIssue, setEditingIssue] = useState<ServiceIssueItem | null>(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [repairTime, setRepairTime] = useState("");
  const [cost, setCost] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const attendedIssues = issues.filter((i) => i.attend);
  const pendingIssues = issues.filter((i) => !i.attend);
  const formatedIssues = [
    ...pendingIssues.map((i) => ({ value: i.id, label: i.issue })),
    ...(editingIssue ? [{ value: editingIssue.id, label: editingIssue.issue }] : []),
  ];

  const truncateText = (text: string, max = 80) =>
    text.length > max ? `${text.slice(0, max)}...` : text;

  const startEdit = (issue: ServiceIssueItem) => {
    setEditingIssue(issue);
    setSelectedIssue({ value: issue.id, label: issue.issue });
    setDiagnosis(issue.diagnosis ?? "");
    setRepairTime(issue.repair_time ?? "");
    setCost(issue.cost != null ? String(issue.cost) : "");
  };

  const addDiagnosis = async () => {
    if (submitting) {
      return;
    }
    if (!selectedIssue) {
      showToast("error", "Detalle de ingreso", "Debes seleccionar un detalle de ingreso.");
      return;
    }
    if (!diagnosis.trim() || !repairTime.trim() || cost.trim() === "") {
      showToast("error", "Datos inválidos", "Completa diagnóstico, tiempo y costo.");
      return;
    }

    setSubmitting(true);
    try {
      const numericCost = parseFloat(cost) || 0;
      const response = await addDiagnosisRequest(service.id, {
        issue_id: Number(selectedIssue.value),
        diagnosis: diagnosis.trim(),
        repair_time: repairTime.trim(),
        cost: numericCost,
      });

      showToast("success", "Diagnostico", response.message ?? "Diagnostico guardado");

      const selectedId = Number(selectedIssue.value);
      setIssues((prev) =>
        prev.map((issue) => {
          if (issue.id !== selectedId) {
            return issue;
          }
          return {
            ...issue,
            attend: true,
            diagnosis: diagnosis.trim(),
            repair_time: repairTime.trim(),
            cost: numericCost,
          };
        })
      );
      setSelectedIssue(null);
      setEditingIssue(null);
      setDiagnosis("");
      setRepairTime("");
      setCost("");
      await queryClient.invalidateQueries({ queryKey: ["services"] });
    } catch {
      showToast("error", "Error", "No se pudo guardar el diagnostico");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinalize = async () => {
    if (finalizing) {
      return;
    }
    setFinalizing(true);
    try {
      const response = await toSparePartsRequest(service.id);
      await queryClient.invalidateQueries({ queryKey: ["services"] });
      await queryClient.invalidateQueries({ queryKey: ["countTypeServices"] });
      showToast("success", "Repuestos", response.message ?? "Servicio pasado a repuestos");
      closeModal();
    } catch {
      showToast("error", "Error", "No se pudo pasar el servicio a repuestos");
    } finally {
      setFinalizing(false);
    }
  };

  const handleAddImages = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        showToast("error", "Permiso denegado", "Debes permitir el acceso a tus fotos.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 9,
      });

      if (result.canceled) return;

      setUploading(true);
      try {
        const response = await uploadServiceImagesRequest(service.id, result.assets);
        if (response.data) {
          setFiles(response.data);
        }
        await queryClient.invalidateQueries({ queryKey: ["services"] });
        showToast("success", "Imagenes", response.message ?? "Imagen subida satisfactoriamente");
      } catch {
        showToast("error", "Error", "No se pudo subir la imagen");
      } finally {
        setUploading(false);
      }
    } catch {
      showToast("error", "Error", "No fue posible seleccionar las imágenes.");
    }
  };

  const handleRemoveImage = (index: number) => {
    const fileToDelete = files[index];
    if (!fileToDelete) return;

    Alert.alert("Eliminar imagen", "¿Deseas eliminar esta imagen?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteServiceImageRequest(service.id, fileToDelete.id);
            setFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
            await queryClient.invalidateQueries({ queryKey: ["services"] });
            showToast("success", "Imagenes", "Imagen eliminada satisfactoriamente");
          } catch {
            showToast("error", "Error", "No se pudo eliminar la imagen");
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={{ maxHeight: 520 }} showsVerticalScrollIndicator={false}>
      <Text style={[styles.formTitle, { color: colors.text }]}>Diagnóstico del servicio a reparar</Text>
      <Text style={{ color: colors.subtitle, fontSize: 13, lineHeight: 18, marginBottom: 16 }}>
        Seleccioná un detalle de ingreso y registrá el diagnóstico, tiempo y costo estimado.
      </Text>

      {issues.length === 0 && (
        <Text style={{ color: colors.subtitle, fontSize: 13, marginBottom: 16 }}>
          No hay detalles de ingreso para este servicio.
        </Text>
      )}

      <AppSelect
        label="Detalle de ingreso"
        placeholder="Selecciona un detalle de ingreso"
        title="Detalle de ingreso"
        data={formatedIssues}
        selected={selectedIssue}
        onSelect={(item) => {
          setSelectedIssue(item);
          if (editingIssue && item && Number(item.value) !== editingIssue.id) {
            setEditingIssue(null);
          }
        }}
        required
      />

      {attendedIssues.length > 0 && (
        <AppSectionTitle containerStyle={{ marginTop: 4 }}>Motivos de ingreso atendidos</AppSectionTitle>
      )}
      {attendedIssues.map((issue) => {
        const isEditing = editingIssue?.id === issue.id;
        return (
          <Pressable
            key={issue.id}
            onPress={() => startEdit(issue)}
            style={[
              styles.attendedCard,
              {
                borderColor: isEditing ? colors.primary : colors.border,
                backgroundColor: colors.surface,
              },
            ]}
          >
            <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontWeight: "600", fontSize: 14 }}>{issue.issue}</Text>
              {issue.diagnosis && (
                <Text style={{ color: colors.subtitle, fontSize: 13 }} numberOfLines={2}>
                  {truncateText(issue.diagnosis)}
                </Text>
              )}
              {isEditing && (
                <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "600", marginTop: 2 }}>
                  Editando este detalle...
                </Text>
              )}
            </View>
            <Ionicons name="pencil" size={16} color={colors.subtitle} />
          </Pressable>
        );
      })}

      <View style={{ marginTop: 4 }}>
        <AppTextInput
          label="Diagnóstico"
          value={diagnosis}
          onChangeText={setDiagnosis}
          multiline
          required
          textAlignVertical="top"
          style={{ minHeight: 90 }}
          editable={!submitting}
        />
        <AppTextInput label="Tiempo" value={repairTime} onChangeText={setRepairTime} required editable={!submitting} />
        <AppTextInput
          label="Costo"
          value={cost}
          onChangeText={setCost}
          keyboardType="numeric"
          required
          editable={!submitting}
        />
        <AppButton
          title={editingIssue ? "Actualizar Diagnóstico" : "Agregar Diagnóstico"}
          variant="outline"
          onPress={addDiagnosis}
          loading={submitting}
          icon={
            <Ionicons
              name={editingIssue ? "refresh" : "add-circle"}
              size={18}
              color={colors.primary}
            />
          }
        />
      </View>

      <AppSectionTitle containerStyle={{ marginTop: 16 }}>Fotos y registros del servicio</AppSectionTitle>
      <AppPhotoGrid
        images={files.map((f) => `${appUrl}/storage/${f.path}`)}
        onAdd={handleAddImages}
        onRemove={uploading ? undefined : handleRemoveImage}
        maxImages={9}
      />

      <View style={[styles.finalizeBox, { borderColor: colors.primary }]}>
        <AppSectionTitle>Finalizar diagnóstico</AppSectionTitle>
        <Text style={{ color: colors.subtitle, fontSize: 13, marginBottom: 12 }}>
          Una vez cargados todos los diagnósticos, pasá al siguiente paso.
        </Text>
        <AppButton
          title="Finalizar y pasar a repuestos"
          variant="contrast"
          onPress={handleFinalize}
          loading={finalizing}
          icon={<Ionicons name="arrow-forward-circle" size={20} color={colors.contrastText} />}
        />
      </View>
    </ScrollView>
  );
}

export function ToDiagnosisForm({ service }: FormProps) {
  const scheme = useColorScheme() ?? "dark";
  const colors = Colors[scheme];
  const { closeModal } = useModal();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const handleSend = async (method: string) => {
    try {
      setLoading(true);
      const response = await toDiagnosisRequest(service.id, method);
      await queryClient.invalidateQueries({ queryKey: ["services"] });
      await queryClient.invalidateQueries({ queryKey: ["countTypeServices"] });
      showToast("success", "Diagnostico", response.message ?? "Solicitud enviada");
      if (response.data?.whatsapp_url) {
        Linking.openURL(response.data.whatsapp_url);
      }
      closeModal();
    } catch {
      showToast("error", "Error", "No se pudo enviar la solicitud de aprobacion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ maxHeight: 500 }}>
      <AppSectionTitle>Servicio a seccion de Diagnostico</AppSectionTitle>
      <Text style={{ color: colors.subtitle, fontSize: 13, lineHeight: 18, marginBottom: 16 }}>
        El producto entrará a taller, tu cliente debe aprobar el comienzo de la reparación. ¿Cómo deseas solicitar la aprobación?
      </Text>
      <AppButton
        title="Via correo"
        variant="outline"
        onPress={() => handleSend("email")}
        loading={loading}
        icon={<Ionicons name="mail" size={18} color={colors.primary} />}
        style={{ marginBottom: 8 }}
      />
      <AppButton
        title="Via WhatsApp"
        variant="outline"
        onPress={() => handleSend("whatsapp")}
        loading={loading}
        icon={<Ionicons name="logo-whatsapp" size={18} color="#25D366" />}
        style={{ marginBottom: 8 }}
      />
      <AppButton
        title="Verbalmente aprobado"
        variant="contrast"
        onPress={() => handleSend("verbal")}
        loading={loading}
        icon={<Ionicons name="checkmark-circle" size={20} color={colors.contrastText} />}
      />
    </ScrollView>
  );
}

export function GoBackForm({ service }: FormProps) {
  const scheme = useColorScheme() ?? "dark";
  const colors = Colors[scheme];
  const { closeModal } = useModal();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const handleGoBack = async () => {
    try {
      setLoading(true);
      await goBackServiceRequest(service.id, service.status_id);
      await queryClient.invalidateQueries({ queryKey: ["services"] });
      await queryClient.invalidateQueries({ queryKey: ["countTypeServices"] });
      showToast("success", "Regresar", "Servicio regresado al estado anterior");
      closeModal();
    } catch {
      showToast("error", "Error", "No se pudo regresar el servicio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ maxHeight: 500 }}>
      <AppSectionTitle>Regresar servicio a estado anterior</AppSectionTitle>
      <Text style={{ color: colors.subtitle, fontSize: 13, lineHeight: 18, marginBottom: 20 }}>
        El servicio volverá a la sección anterior del flujo de trabajo.
      </Text>
      <Text style={{ color: colors.text, fontWeight: "700", marginBottom: 4 }}>
        Regresar servicio
      </Text>
      <Text style={{ color: colors.subtitle, fontSize: 13, marginBottom: 16 }}>
        Confirmá para continuar con el cambio de estado.
      </Text>
      <AppButton
        title="Regresar"
        variant="contrast"
        onPress={handleGoBack}
        loading={loading}
        icon={<Ionicons name="arrow-undo" size={20} color={colors.contrastText} />}
      />
    </ScrollView>
  );
}

export function ToCostApprovalTransitionForm({ service }: FormProps) {
  const scheme = useColorScheme() ?? "dark";
  const colors = Colors[scheme];
  const { closeModal } = useModal();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    try {
      setLoading(true);
      const response = await toCostApprovalRequest(service.id);
      await queryClient.invalidateQueries({ queryKey: ["services"] });
      await queryClient.invalidateQueries({ queryKey: ["countTypeServices"] });
      showToast("success", "Aprobación de costos", response.message ?? "Servicio enviado a aprobación de costos");
      closeModal();
    } catch {
      showToast("error", "Error", "No se pudo enviar el servicio a aprobación de costos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ maxHeight: 500 }}>
      <AppSectionTitle>Enviar a aprobación de costos</AppSectionTitle>
      <Text style={{ color: colors.subtitle, fontSize: 13, lineHeight: 18, marginBottom: 20 }}>
        El servicio pasará a la sección de aprobación de costos. Ahí podrás solicitar la aprobación del cliente por correo, whatsapp o verbalmente.
      </Text>
      <Text style={{ color: colors.text, fontWeight: "700", marginBottom: 4 }}>
        Enviar a aprobación
      </Text>
      <Text style={{ color: colors.subtitle, fontSize: 13, marginBottom: 16 }}>
        El servicio avanzará al siguiente paso del flujo.
      </Text>
      <AppButton
        title="Enviar a aprobación de costos"
        variant="contrast"
        onPress={handleSend}
        loading={loading}
        icon={<Ionicons name="cash-outline" size={20} color={colors.contrastText} />}
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
      await queryClient.invalidateQueries({ queryKey: ["countTypeServices"] });
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
      <AppSectionTitle>Aprobación de costos</AppSectionTitle>
      <View style={[styles.totalRow, { borderColor: colors.border }]}>
        <Text style={{ color: colors.text, fontWeight: "600" }}>Total diagnostico:</Text>
        <Text style={{ color: colors.primary, fontWeight: "bold", fontSize: 18 }}>
          ${totalDiagnosis.toLocaleString()}
        </Text>
      </View>
      <Text style={{ color: colors.subtitle, fontSize: 13, lineHeight: 18, marginBottom: 16 }}>
        El servicio pasará a reparación cuando el cliente apruebe los costos del diagnóstico. ¿Cómo deseas solicitar la aprobación?
      </Text>
      <AppButton
        title="Via correo"
        variant="outline"
        onPress={() => handleApprove("email")}
        loading={loading}
        icon={<Ionicons name="mail" size={18} color={colors.primary} />}
        style={{ marginBottom: 8 }}
      />
      <AppButton
        title="Via whatsapp"
        variant="outline"
        onPress={() => handleApprove("whatsapp")}
        loading={loading}
        icon={<Ionicons name="logo-whatsapp" size={18} color="#25D366" />}
        style={{ marginBottom: 8 }}
      />
      <AppButton
        title="Verbalmente aprobado"
        variant="outline"
        onPress={() => handleApprove("verbal")}
        loading={loading}
        icon={<Ionicons name="checkmark-circle" size={18} color={colors.primary} />}
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
      await queryClient.invalidateQueries({ queryKey: ["countTypeServices"] });
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
      await queryClient.invalidateQueries({ queryKey: ["countTypeServices"] });
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
      <AppSectionTitle>Reparacion - #{service.uuid}</AppSectionTitle>
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
        icon={<Ionicons name="checkmark-circle" size={20} color={colors.contrastText} />}
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
      await queryClient.invalidateQueries({ queryKey: ["countTypeServices"] });
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
      <AppSectionTitle>Entregar servicio - #{service.uuid}</AppSectionTitle>
      <Text style={{ color: colors.subtitle, marginBottom: 16 }}>
        Confirma la entrega del servicio al cliente.
      </Text>
      <AppButton
        title="Marcar como entregado"
        variant="contrast"
        onPress={handleDeliver}
        loading={loading}
        icon={<Ionicons name="checkmark-done-circle" size={20} color={colors.contrastText} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  formTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  attendedCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
  },
  finalizeBox: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    marginBottom: 8,
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
