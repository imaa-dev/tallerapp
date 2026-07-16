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


export default function LoginScreen() {

  const router = useRouter();

  const authContext = useContext(AuthContext);

  const scheme = useColorScheme() ?? "dark";

  const colors = Colors[scheme];


  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");


  const handleLogin = async () => {

    setLoading(true);

    try {

      const response = await loginRequest({
        email,
        password,
      });


      await authContext.login(
        response.token,
        response.user,
        response.organization_id
      );


    } catch(error) {

      console.log(
        "Login Error",
        error
      );


    } finally {

      setLoading(false);

    }

  };


  return (

    <AppScreen>

      <View
        style={styles.container}
      >


        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            }
          ]}
        >
          Iniciar Sesión
        </Text>



        <View
          style={styles.form}
        >


          <AppTextInput

            label="Correo"

            placeholder="correo@ejemplo.com"

            value={email}

            onChangeText={setEmail}

            keyboardType="email-address"

            autoCapitalize="none"

          />



          <AppTextInput

            label="Contraseña"

            placeholder="Ingrese contraseña"

            value={password}

            onChangeText={setPassword}

            secureTextEntry

          />



          <AppButton

            title="Entrar"
            variant="contrast"
            loading={loading}

            onPress={handleLogin}

          />


        </View>


      </View>


    </AppScreen>

  );

}



const styles = StyleSheet.create({

  container: {

    flex:1,

    justifyContent:"center",

    paddingHorizontal:24,

  },


  title: {

    fontSize:28,

    fontWeight:"700",

    textAlign:"center",

    marginBottom:40,

  },


  form: {

    gap:18,

  },


});