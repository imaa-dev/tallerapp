import { View, StyleSheet, useColorScheme, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Colors } from "@/constants/theme";
import { useToast } from "@/context/ToastContext";
import AppTextInput from "@/components/ui/AppTextInput";
import AppButton from "@/components/ui/AppButton";
import AppPageTitle from "@/components/ui/AppPageTitle";
import { updatePasswordRequest } from "@/services/settings/settings.service";

export default function PasswordScreen() {
  const scheme = useColorScheme() ?? "dark";
  const colors = Colors[scheme];
  const { showToast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{
    current_password?: string;
    password?: string;
  }>({});

  const handleSave = async () => {
    if (saving) {
      return;
    }
    if (!currentPassword || !password) {
      showToast("error", "Contraseña", "Completá todos los campos.");
      return;
    }
    if (password !== passwordConfirmation) {
      setErrors({ password: "Las contraseñas no coinciden." });
      showToast("error", "Contraseña", "Las contraseñas no coinciden.");
      return;
    }
    setSaving(true);
    setErrors({});
    try {
      const response = await updatePasswordRequest({
        current_password: currentPassword,
        password,
        password_confirmation: passwordConfirmation,
      });
      setCurrentPassword("");
      setPassword("");
      setPasswordConfirmation("");
      showToast("success", "Contraseña", response.message ?? "Contraseña actualizada");
    } catch (err: any) {
      const data = err?.response?.data;
      const fieldErrors = data?.errors;
      if (fieldErrors) {
        setErrors({
          current_password: fieldErrors.current_password?.[0],
          password: fieldErrors.password?.[0],
        });
      }
      showToast("error", "Error", data?.message ?? "No se pudo actualizar la contraseña");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <AppPageTitle
        title="Contraseña"
        icon={<Ionicons name="lock-closed-outline" size={20} color={colors.text} />}
      />

      <View style={{ gap: 12 }}>
        <AppTextInput
          label="Contraseña actual"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          error={errors.current_password}
          required
          editable={!saving}
        />
        <AppTextInput
          label="Nueva contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={errors.password}
          required
          editable={!saving}
        />
        <AppTextInput
          label="Confirmar nueva contraseña"
          value={passwordConfirmation}
          onChangeText={setPasswordConfirmation}
          secureTextEntry
          required
          editable={!saving}
        />

        <AppButton
          title="Actualizar contraseña"
          variant="contrast"
          onPress={handleSave}
          loading={saving}
          icon={<Ionicons name="key-outline" size={18} color={colors.contrastText} />}
          style={{ marginTop: 8 }}
        />
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