import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Controller, useForm } from "react-hook-form";
import { Colors } from "@/constants/theme";
import { useModal } from "@/context/ModalContextForm";
import { useToast } from "@/context/ToastContext";
import { useQueryClient } from "@tanstack/react-query";
import AppTextInput from "@/components/ui/AppTextInput";
import AppButton from "@/components/ui/AppButton";
import AppSectionTitle from "@/components/ui/AppSectionTitle";
import { createSparePartRequest } from "@/services/spare-part/spare-part.service";

type FormData = {
  model: string;
  brand: string;
  note: string;
  price: string;
};

type Props = {
  onCreated?: (id: number) => void;
};

export function CreateSparePartForm({ onCreated }: Props) {
  const scheme = useColorScheme() ?? "dark";
  const colors = Colors[scheme];
  const { closeModal } = useModal();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [saving, setSaving] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      model: "",
      brand: "",
      note: "",
      price: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    if (saving) {
      return;
    }
    setSaving(true);
    try {
      const response = await createSparePartRequest({
        model: data.model.trim(),
        brand: data.brand.trim(),
        note: data.note.trim(),
        price: parseFloat(data.price) || 0,
      });
      showToast(
        "success",
        "Repuesto",
        response.message ?? "Pieza de repuesto creada satisfactoriamente"
      );
      await queryClient.invalidateQueries({ queryKey: ["spareParts"] });
      const createdId = response?.data?.id ?? response?.id;
      if (createdId != null) {
        onCreated?.(createdId);
      }
      closeModal();
    } catch {
      showToast("error", "Error", "No se pudo crear el repuesto");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={{ maxHeight: 520 }} showsVerticalScrollIndicator={false}>
      <AppSectionTitle style={{ textTransform: "none", opacity: 1, fontSize: 16 }}>
        Agregar pieza de repuesto
      </AppSectionTitle>
      <Text style={{ color: colors.subtitle, fontSize: 13, lineHeight: 18, marginBottom: 16 }}>
        Registra una nueva pieza de repuesto.
      </Text>

      <Controller
        control={control}
        name="model"
        rules={{ required: "El modelo es obligatorio" }}
        render={({ field: { value, onChange } }) => (
          <AppTextInput
            label="Modelo"
            value={value}
            onChangeText={onChange}
            placeholder="Modelo"
            required
            error={errors.model?.message}
            editable={!saving}
          />
        )}
      />

      <Controller
        control={control}
        name="brand"
        rules={{ required: "La marca es obligatoria" }}
        render={({ field: { value, onChange } }) => (
          <AppTextInput
            label="Marca"
            value={value}
            onChangeText={onChange}
            placeholder="Marca"
            required
            error={errors.brand?.message}
            editable={!saving}
          />
        )}
      />

      <Controller
        control={control}
        name="note"
        rules={{ required: "La nota es obligatoria" }}
        render={({ field: { value, onChange } }) => (
          <AppTextInput
            label="Nota Maestro"
            value={value}
            onChangeText={onChange}
            placeholder="Nota Maestro"
            required
            error={errors.note?.message}
            editable={!saving}
          />
        )}
      />

      <Controller
        control={control}
        name="price"
        rules={{ required: "El precio es obligatorio" }}
        render={({ field: { value, onChange } }) => (
          <AppTextInput
            label="Precio"
            value={value}
            onChangeText={onChange}
            placeholder="0.00"
            keyboardType="numeric"
            required
            error={errors.price?.message}
            editable={!saving}
          />
        )}
      />

      <View style={[styles.actionBox, { borderColor: colors.primary }]}>
        <View>
          <Text style={{ color: colors.text, fontWeight: "600" }}>Crear repuesto</Text>
          <Text style={{ color: colors.subtitle, fontSize: 13, marginBottom: 12 }}>
            La pieza se agregará al listado de repuestos.
          </Text>
        </View>
        <AppButton
          title="Crear pieza de repuesto"
          variant="contrast"
          onPress={handleSubmit(onSubmit)}
          loading={saving}
          icon={<Ionicons name="save" size={18} color={colors.background} />}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  actionBox: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 8,
  },
});