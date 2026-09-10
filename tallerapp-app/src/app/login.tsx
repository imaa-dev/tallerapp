import {
  View,
  StyleSheet,
  Text,
  useColorScheme,
} from "react-native";
import {
  useContext,
  useState
} from "react";
import { useRouter } from "expo-router";
import { AuthContext } from "@/context/authContext";
import { loginRequest } from "@/services/auth/auth.service";
import AppScreen from "@/components/ui/AppScreen";
import AppTextInput from "@/components/ui/AppTextInput";
import AppButton from "@/components/ui/AppButton";
import { Colors } from "@/constants/theme";
import { useToast } from "@/context/ToastContext";
import { Controller, useForm } from "react-hook-form";
import { LoginMultiOrgResponse } from "@/types/auth/auth.type";

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginScreen() {

  const router = useRouter();
  const authContext = useContext(AuthContext);
  const scheme = useColorScheme() ?? "dark";
  const colors = Colors[scheme];
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<LoginFormData>({
      defaultValues: {
        email: "",
        password: "",
      },
  });
  const handleLogin = async (email: string, password: string) => {

    setLoading(true);
    try {
      const response = await loginRequest({
        email,
        password,
      });

      if (response.success && response.token && response.user) {
        authContext.login(response.token, response.user);
        router.push("/");
      } else if (!response.success && response.login_id && response.organizations) {
        authContext.startPendingLogin({
          loginId: response.login_id,
          user: response.user,
          organizations: response.organizations,
        });
        router.push({
          pathname: "/select-organization",
          params: {
            organizations: JSON.stringify(response.organizations),
          },
        });
      }
      
    } catch (error: any) {
      const message =
        error?.response?.data?.message ?? "Por favor, intenta de nuevo";
      showToast(
        "error",
        "Error al iniciar sesión",
        message
      )
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data: LoginFormData) => {
    handleLogin(data.email, data.password);
  };
  return (
     <AppScreen>
      <View style={styles.container}>
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
        >
          Iniciar Sesion
        </Text>

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            rules={{
              required: "El correo es obligatorio",
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
            }}
            render={({ field: { onChange, value } }) => (
              <AppTextInput
                label="Contrasena"
                placeholder="Ingrese contrasena"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                error={errors.password?.message}
              />
            )}
          />

          <AppButton
            title="Entrar"
            variant="contrast"
            loading={loading}
            onPress={handleSubmit(onSubmit)}
          />
        </View>

        <View style={styles.registerContainer}>
          <Text style={[styles.registerText, { color: colors.text }]}>
            No tienes una cuenta?{" "}
          </Text>
          <AppButton
            title="Registrate"
            variant="outline"
            onPress={() => router.push("/register")}
            fullWidth={false}
          />
        </View>
      </View>
    </AppScreen>
  );

}



const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 40,

  },

  form: {
    gap: 18,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  registerText: {
    fontSize: 14,
  },
});