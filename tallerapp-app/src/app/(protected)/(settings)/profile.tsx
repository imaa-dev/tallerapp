import { View, StyleSheet, useColorScheme, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useContext, useState } from "react";
import { Colors } from "@/constants/theme";
import { AuthContext } from "@/context/authContext";
import { useToast } from "@/context/ToastContext";
import AppTextInput from "@/components/ui/AppTextInput";
import AppButton from "@/components/ui/AppButton";
import AppPageTitle from "@/components/ui/AppPageTitle";
import { updateProfileRequest } from "@/services/settings/settings.service";

export default function ProfileScreen() {
  const scheme = useColorScheme() ?? "dark";
  const colors = Colors[scheme];
  const { user, updateProfile, logout } = useContext(AuthContext);
  const { showToast } = useToast();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const handleSave = async () => {
    if (saving) {
      return;
    }
    setSaving(true);
    setErrors({});
    try {
      const response = await updateProfileRequest(name.trim(), email.trim());
      updateProfile(response.data?.name ?? name.trim(), response.data?.email ?? email.trim());
      showToast("success", "Perfil", response.message ?? "Perfil actualizado");
    } catch (err: any) {
      const data = err?.response?.data;
      const fieldErrors = data?.errors;
      if (fieldErrors) {
        setErrors({
          name: fieldErrors.name?.[0],
          email: fieldErrors.email?.[0],
        });
      }
      showToast("error", "Error", data?.message ?? "No se pudo actualizar el perfil");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <AppPageTitle
        title="Perfil"
        icon={<Ionicons name="person-outline" size={20} color={colors.text} />}
      />

      <View style={{ gap: 12 }}>
        <AppTextInput
          label="Nombre"
          value={name}
          onChangeText={setName}
          error={errors.name}
          required
          editable={!saving}
        />
        <AppTextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          error={errors.email}
          required
          editable={!saving}
        />

        <AppButton
          title="Guardar cambios"
          variant="contrast"
          onPress={handleSave}
          loading={saving}
          icon={<Ionicons name="save-outline" size={18} color={colors.contrastText} />}
          style={{ marginTop: 8 }}
        />

        <View style={{ marginTop: 32 }}>
          <AppButton
            title="Cerrar sesión"
            variant="outline"
            onPress={handleLogout}
            icon={<Ionicons name="log-out-outline" size={18} color="#DC2626" />}
            style={{ borderColor: "#DC2626" }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
});