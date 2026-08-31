import {
  View,
  StyleSheet,
  Text,
  useColorScheme,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { AuthContext } from "@/context/authContext";
import {
  registerRequest,
  getWorkshopTypesRequest,
} from "@/services/auth/auth.service";
import AppScreen from "@/components/ui/AppScreen";
import AppTextInput from "@/components/ui/AppTextInput";
import AppButton from "@/components/ui/AppButton";
import { Colors } from "@/constants/theme";
import { useToast } from "@/context/ToastContext";
import { Controller, useForm } from "react-hook-form";
import { WorkshopType } from "@/types/workshop-type/workshop-type.type";
import { Check } from "lucide-react-native";

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  nameOrganization: string;
  workshop_type_id: number | null;
};

const STEPS = [
  {
    title: "Quien esta creando la cuenta?",
    description: "Ingresa el nombre del administrador o cliente que la crea.",
  },
  {
    title: "Como se llama tu negocio?",
    description: "Ingresa el nombre del taller o negocio.",
  },
  {
    title: "Que tipo de taller es?",
    description:
      "Selecciona el tipo de taller para configurar tu espacio.",
  },
  {
    title: "Crea tu cuenta",
    description: "Ingresa tu email y una contrasena segura.",
  },
];

export default function RegisterScreen() {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const scheme = useColorScheme() ?? "dark";
  const colors = Colors[scheme];
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [workshopTypes, setWorkshopTypes] = useState<WorkshopType[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch,
    setValue,
  } = useForm<RegisterFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      nameOrganization: "",
      workshop_type_id: null,
    },
  });

  const workshopTypeId = watch("workshop_type_id");

  useEffect(() => {
    const loadWorkshopTypes = async () => {
      try {
        const types = await getWorkshopTypesRequest();
        setWorkshopTypes(types);
      } catch (error) {
        showToast(
          "error",
          "Error",
          "No se pudieron cargar los tipos de taller"
        );
      }
    };
    loadWorkshopTypes();
  }, []);

  const next = () => {
    if (step === 1) {
      const name = watch("name");
      if (!name?.trim()) {
        setError("name", { message: "Ingresa tu nombre" });
        return;
      }
    } else if (step === 2) {
      const nameOrg = watch("nameOrganization");
      if (!nameOrg?.trim()) {
        setError("nameOrganization", {
          message: "Ingresa el nombre de tu negocio",
        });
        return;
      }
    } else if (step === 3) {
      if (!workshopTypeId) {
        setError("workshop_type_id", {
          message: "Selecciona el tipo de taller",
        });
        return;
      }
    }
    setStep(step + 1);
  };

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      const response = await registerRequest({
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
        nameOrganization: data.nameOrganization,
        workshop_type_id: data.workshop_type_id!,
      });

      if (response.token && response.user) {
        authContext.login(response.token, response.user);
        router.push("/");
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Ocurrio un error al crear la cuenta";
      showToast("error", "Error al registrar", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <Text style={[styles.title, { color: colors.text }]}>
              {STEPS[step - 1].title}
            </Text>

            <Text style={[styles.subtitle, { color: colors.text }]}>
              {STEPS[step - 1].description}
            </Text>

            <View style={styles.progress}>
              {STEPS.map((_, i) => {
                const num = i + 1;
                const active = num === step;
                const done = num < step;
                return (
                  <View key={i} style={styles.progressItem}>
                    <View
                      style={[
                        styles.progressDot,
                        {
                          backgroundColor: active
                            ? colors.primary
                            : done
                              ? colors.primary + "80"
                              : colors.border,
                        },
                      ]}
                    />
                    {num < STEPS.length && (
                      <View
                        style={[
                          styles.progressLine,
                          {
                            backgroundColor: done
                              ? colors.primary + "80"
                              : colors.border,
                          },
                        ]}
                      />
                    )}
                  </View>
                );
              })}
            </View>

            <Text style={[styles.stepIndicator, { color: colors.text }]}>
              Paso {step} de {STEPS.length}
            </Text>

            {step === 1 && (
              <Controller
                control={control}
                name="name"
                rules={{ required: "El nombre es obligatorio" }}
                render={({ field: { onChange, value } }) => (
                  <AppTextInput
                    label="Nombre"
                    placeholder="Nombre completo"
                    value={value}
                    onChangeText={(text) => {
                      onChange(text);
                      clearErrors("name");
                    }}
                    autoCapitalize="words"
                    error={errors.name?.message}
                  />
                )}
              />
            )}

            {step === 2 && (
              <Controller
                control={control}
                name="nameOrganization"
                rules={{
                  required: "El nombre del negocio es obligatorio",
                }}
                render={({ field: { onChange, value } }) => (
                  <AppTextInput
                    label="Nombre del negocio"
                    placeholder="Ej: Taller Mecanico El Maestro"
                    value={value}
                    onChangeText={(text) => {
                      onChange(text);
                      clearErrors("nameOrganization");
                    }}
                    autoCapitalize="words"
                    error={errors.nameOrganization?.message}
                  />
                )}
              />
            )}

            {step === 3 && (
              <View style={styles.workshopList}>
                {workshopTypes.map((type) => {
                  const selected = workshopTypeId === type.id;
                  return (
                    <AppButton
                      key={type.id}
                      title={type.name}
                      variant={selected ? "contrast" : "outline"}
                      onPress={() => {
                        setValue("workshop_type_id", type.id);
                        clearErrors("workshop_type_id");
                      }}
                      icon={
                        selected ? (
                          <Check size={18} color={colors.primary} />
                        ) : undefined
                      }
                    />
                  );
                })}
                {errors.workshop_type_id?.message && (
                  <Text
                    style={[styles.errorText, { color: colors.danger }]}
                  >
                    {errors.workshop_type_id.message}
                  </Text>
                )}
              </View>
            )}

            {step === 4 && (
              <View style={styles.step4}>
                <Controller
                  control={control}
                  name="email"
                  rules={{
                    required: "El correo es obligatorio",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Ingresa un correo valido",
                    },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <AppTextInput
                      label="Correo"
                      placeholder="correo@ejemplo.com"
                      value={value}
                      onChangeText={onChange}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      error={errors.email?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  rules={{
                    required: "La contrasena es obligatoria",
                    minLength: {
                      value: 8,
                      message:
                        "La contrasena debe tener al menos 8 caracteres",
                    },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <AppTextInput
                      label="Contrasena"
                      placeholder="Contrasena"
                      value={value}
                      onChangeText={onChange}
                      secureTextEntry
                      error={errors.password?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="password_confirmation"
                  rules={{
                    required: "Confirma tu contrasena",
                    validate: (value) =>
                      value === watch("password") ||
                      "Las contrasenas no coinciden",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <AppTextInput
                      label="Confirmar contrasena"
                      placeholder="Confirmar contrasena"
                      value={value}
                      onChangeText={onChange}
                      secureTextEntry
                      error={errors.password_confirmation?.message}
                    />
                  )}
                />
              </View>
            )}

            <View style={styles.actions}>
              {step < STEPS.length ? (
                <AppButton
                  title="Continuar"
                  variant="contrast"
                  onPress={next}
                />
              ) : (
                <AppButton
                  title="Crear Cuenta"
                  variant="contrast"
                  loading={loading}
                  onPress={handleSubmit(onSubmit)}
                />
              )}

              {step > 1 && (
                <AppButton
                  title="Atras"
                  variant="secondary"
                  onPress={() => setStep(step - 1)}
                  disabled={loading}
                />
              )}
            </View>

            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: colors.text }]}>
                Ya tienes una cuenta?{" "}
              </Text>
              <AppButton
                title="Iniciar sesion"
                variant="outline"
                onPress={() => router.push("/login")}
                fullWidth={false}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    opacity: 0.7,
  },
  progress: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  progressItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  progressLine: {
    width: 32,
    height: 2,
  },
  stepIndicator: {
    textAlign: "center",
    fontSize: 12,
    marginBottom: 24,
    opacity: 0.5,
  },
  workshopList: {
    gap: 12,
  },
  errorText: {
    fontSize: 13,
    marginTop: 4,
  },
  step4: {
    gap: 4,
  },
  actions: {
    gap: 12,
    marginTop: 24,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
  },
});
