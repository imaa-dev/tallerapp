import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { useModal } from "@/context/ModalContextForm";
import { useToast } from "@/context/ToastContext";
import { useQueryClient } from "@tanstack/react-query";
import AppButton from "@/components/ui/AppButton";
import AppSectionTitle from "@/components/ui/AppSectionTitle";
import MultiSelectBottomSheet from "@/components/MultiSelectBottomSheet";
import { CreateSparePartForm } from "@/components/services/CreateSparePartForm";
import { useSpareParts } from "@/hooks/useSpareParts";
import {
  assignSparePartsRequest,
  removeSparePartRequest,
} from "@/services/services/service-status.service";
import { ServiceRecord } from "@/types/servi/servi.type";

type Props = {
  service: ServiceRecord;
};

export function AddSparePartsForm({ service }: Props) {
  const scheme = useColorScheme() ?? "dark";
  const colors = Colors[scheme];
  const { closeModal, openModal } = useModal();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [listedSpareParts, setListedSpareParts] = useState<any[]>(
    service.spareparts ?? []
  );
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const { data } = useSpareParts({ per_page: 100 });

  const freeParts = useMemo(
    () =>
      (data?.spareParts ?? []).filter(
        (sp) => sp.servi_id === null || sp.servi_id === undefined
      ),
    [data]
  );

  const options = useMemo(
    () =>
      freeParts.map((sp) => ({
        value: sp.id,
        label: `${sp.model} ${sp.brand} $${sp.price?.toLocaleString?.() ?? sp.price}`,
      })),
    [freeParts]
  );

  const refreshQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: ["services"] });
    await queryClient.invalidateQueries({ queryKey: ["countTypeServices"] });
  };

  const handleCreated = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleRemove = async (sparePartId: number) => {
    if (removingId !== null || saving) {
      return;
    }
    setRemovingId(sparePartId);
    try {
      const response = await removeSparePartRequest(service.id, sparePartId);
      setListedSpareParts((prev) => prev.filter((sp) => sp.id !== sparePartId));
      await refreshQueries();
      showToast("success", "Repuestos", response.message ?? "Repuesto quitado del servicio");
    } catch {
      showToast("error", "Error", "No se pudo quitar el repuesto");
    } finally {
      setRemovingId(null);
    }
  };

  const handleSubmit = async () => {
    if (saving) {
      return;
    }
    if (selectedIds.length === 0) {
      showToast("error", "Repuestos", "Debes seleccionar al menos un repuesto.");
      return;
    }
    setSaving(true);
    try {
      const response = await assignSparePartsRequest(service.id, selectedIds);
      await refreshQueries();
      showToast("success", "Repuestos", response.message ?? "Repuestos agregados al servicio");
      closeModal();
    } catch {
      showToast("error", "Error", "No se pudieron agregar los repuestos");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={{ maxHeight: 520 }} showsVerticalScrollIndicator={false}>
      <AppSectionTitle style={{ textTransform: "none", opacity: 1, fontSize: 16 }}>
        Repuestos
      </AppSectionTitle>
      <Text style={{ color: colors.subtitle, fontSize: 13, lineHeight: 18, marginBottom: 16 }}>
        Seleccioná las piezas de repuesto utilizadas o creá una nueva.
      </Text>

      {listedSpareParts.length > 0 && (
        <View style={{ gap: 8, marginBottom: 16 }}>
          {listedSpareParts.map((sp) => (
            <View
              key={sp.id}
              style={[styles.listedItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontWeight: "600", fontSize: 14 }} numberOfLines={1}>
                  {sp.brand} - {sp.model}
                </Text>
                <Text style={{ color: colors.success ?? "#16A34A", fontWeight: "700", fontSize: 13 }}>
                  ${Number(sp.price).toLocaleString?.() ?? sp.price}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleRemove(sp.id)}
                disabled={removingId !== null}
                style={[
                  styles.removeButton,
                  {
                    backgroundColor:
                      scheme === "dark" ? "rgba(220,38,38,0.15)" : "#FEE2E2",
                  },
                ]}
              >
                <Ionicons
                  name={removingId === sp.id ? "hourglass-outline" : "trash-outline"}
                  size={16}
                  color="#DC2626"
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <MultiSelectBottomSheet
            data={options}
            selectedValues={selectedIds}
            onConfirm={(items) => setSelectedIds(items.map((i) => i.value))}
            placeholder="Seleccioná los repuestos..."
            title="Seleccionar repuestos"
          />
        </View>
        <TouchableOpacity
          onPress={() => openModal(<CreateSparePartForm onCreated={handleCreated} />)}
          style={[
            styles.plusButton,
            {
              borderColor: colors.primary,
              backgroundColor: colors.surface,
            },
          ]}
        >
          <Ionicons name="add" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={[styles.actionBox, { borderColor: colors.primary }]}>
        <View>
          <Text style={{ color: colors.text, fontWeight: "600" }}>Agregar repuestos</Text>
          <Text style={{ color: colors.subtitle, fontSize: 13, marginBottom: 12 }}>
            Se notificará al cliente sobre los repuestos.
          </Text>
        </View>
        <AppButton
          title="Agregar repuestos"
          variant="contrast"
          onPress={handleSubmit}
          loading={saving}
          disabled={selectedIds.length === 0}
          icon={<Ionicons name="cube-outline" size={18} color={colors.background} />}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  plusButton: {
    width: 54,
    height: 54,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBox: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    marginBottom: 8,
  },
  listedItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 8,
  },
  removeButton: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});