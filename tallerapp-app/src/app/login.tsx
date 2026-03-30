import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/authContext";
import { loginRequest } from "@/services/auth/auth.service";
import { ActivityIndicator } from "react-native";

export default function LoginScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const authContext = useContext(AuthContext)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    setLoading(true)
    try {
      const response = await loginRequest({ email, password });
      await authContext.login(response.token, response.user, response.organization_id)
    } catch (error) {
      console.log("Login Error", error)
    } finally {
      setLoading(false)
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <Pressable 
        style={styles.button} 
        onPress={handleLogin}
        disabled={loading}
      >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ): (
        <Text style={styles.buttonText} >Entrar</Text>
      )}  
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});