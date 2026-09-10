import { View, ScrollView, StyleSheet, useColorScheme, Image, Pressable, Text } from "react-native";
import { useState } from "react";
import { useOrganization } from "@/hooks/useOrganization";
import { Colors } from "@/constants/theme";
import AppLoading from "@/components/ui/AppLoading";
import AppEmptyState from "@/components/ui/AppEmptyState";
import AppCard from "@/components/ui/AppCard";
import AppSectionTitle from "@/components/ui/AppSectionTitle";
import AppPageTitle from "@/components/ui/AppPageTitle";
import AppButton from "@/components/ui/AppButton";
import AppTextInput from "@/components/ui/AppTextInput";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrganizationRequest } from "@/services/organization/organization.service";
import { useToast } from "@/context/ToastContext";
import { useForm, Controller } from "react-hook-form";
import { OrganizationDetail } from "@/types/organization/organization.type";
import * as ImagePicker from "expo-image-picker";
import { appUrl } from "@/config/env";

export default function OrganizationScreen() {
  const { data, isLoading, isError } = useOrganization();
  const scheme = useColorScheme() ?? "dark";
  const colors = Colors[scheme];
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [logoUri, setLogoUri] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<OrganizationDetail>({
    values: data ?? ({} as OrganizationDetail),
  });

  const mutation = useMutation({
    mutationFn: updateOrganizationRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization"] });
      showToast("success", "Exito", "Organizacion actualizada");
    },
    onError: () => {
      showToast("error", "Error", "No se pudo actualizar");
    },
  });

  if (isLoading) return <AppLoading message="Cargando organizacion..." />;
  if (isError || !data) {
    return (
      <AppEmptyState icon="alert-circle-outline" title="Error" description="No se pudo cargar la organizacion." />
    );
  }

  const logoUrl = logoUri ?? (data as any).logo_url
    ? `${appUrl}/storage/${(data as any).logo_url}`
    : null;

  const pickLogo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });
    if (!result.canceled) {
      setLogoUri(result.assets[0].uri);
    }
  };

  const onSubmit = (formData: OrganizationDetail) => {
    mutation.mutate(formData);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppPageTitle
        title="Organizacion"
        icon={<Ionicons name="business-outline" size={20} color={colors.text} />}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <AppCard>
          <AppSectionTitle>Logo</AppSectionTitle>
          <View style={styles.logoSection}>
            {logoUri ? (
              <Image source={{ uri: logoUri }} style={styles.logo} />
            ) : logoUrl ? (
              <Image source={{ uri: logoUrl }} style={styles.logo} />
            ) : (
              <View style={[styles.logoPlaceholder, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Ionicons name="business" size={48} color={colors.subtitle} />
              </View>
            )}
            <AppButton
              title="Cambiar logo"
              variant="outline"
              onPress={pickLogo}
              icon={<Ionicons name="image" size={18} color={colors.primary} />}
              fullWidth={false}
            />
          </View>
        </AppCard>

        <AppCard>
          <AppSectionTitle>Datos generales</AppSectionTitle>
          <Controller
            control={control}
            name="name"
            rules={{ required: "Nombre requerido" }}
            render={({ field: { value, onChange } }) => (
              <AppTextInput label="Nombre" value={value} onChangeText={onChange} />
            )}
          />
          <Controller
            control={control}
            name="description"
            render={({ field: { value, onChange } }) => (
              <AppTextInput label="Descripcion" value={value} onChangeText={onChange} />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <AppTextInput label="Email" value={value} onChangeText={onChange} keyboardType="email-address" />
            )}
          />
          <Controller
            control={control}
            name="phone"
            render={({ field: { value, onChange } }) => (
              <AppTextInput label="Telefono" value={value} onChangeText={onChange} keyboardType="phone-pad" />
            )}
          />
        </AppCard>

        <AppCard>
          <AppSectionTitle>Direccion</AppSectionTitle>
          <Controller
            control={control}
            name="address"
            render={({ field: { value, onChange } }) => (
              <AppTextInput label="Direccion" value={value} onChangeText={onChange} />
            )}
          />
          <Controller
            control={control}
            name="city"
            render={({ field: { value, onChange } }) => (
              <AppTextInput label="Ciudad" value={value} onChangeText={onChange} />
            )}
          />
          <Controller
            control={control}
            name="state"
            render={({ field: { value, onChange } }) => (
              <AppTextInput label="Estado" value={value} onChangeText={onChange} />
            )}
          />
          <Controller
            control={control}
            name="country"
            render={({ field: { value, onChange } }) => (
              <AppTextInput label="Pais" value={value} onChangeText={onChange} />
            )}
          />
        </AppCard>

        <AppButton
          title="Guardar cambios"
          variant="contrast"
          onPress={handleSubmit(onSubmit)}
          icon={<Ionicons name="save" size={20} color={colors.contrastText} />}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  logoSection: {
    alignItems: "center",
    gap: 12,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
