import { useContext, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import AppScreen from "@/components/ui/AppScreen";
import AppButton from "@/components/ui/AppButton";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "react-native";
import { completeLoginRequest } from "@/services/auth/auth.service";
import { useToast } from "@/context/ToastContext";
import { Organization } from "@/types/organization/organization.type";
import { AuthContext } from "@/context/authContext";

export default function SelectOrganization() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { showToast } = useToast();
  const { pendingLogin, login } = useContext(AuthContext);
  const { organizations } = useLocalSearchParams<{
    organizations: string;
  }>();

  const data = useMemo<Organization[]>(
    () => (organizations ? JSON.parse(organizations) : []),
    [organizations]
  );

  const [selected, setSelected] = useState<number | null>(null);

  const handleContinue = async () => {
    try {
        if (!selected) return;
        const response = await completeLoginRequest(pendingLogin?.loginId, selected);
        
        if(response.success){
            login(response.token, response.user);
            
            router.push({
                pathname: "/",
            });
        }
                 
    } catch (error: any) {
        showToast(
            "error",
            "Error al seleccionar organización",
            error
        )
        console.log("Error al seleccionar organización", error);
    } finally {
        console.log('EJECUTAR ERRORES PARA VER SI USO ESTA SECCION')
    }
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
          Selecciona una organización
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color: colors.text,
            },
          ]}
        >
          Elige el taller con el que deseas trabajar.
        </Text>

        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const active = selected === item.id;

            return (
              <AppButton
                title={item.name}
                variant={active ? "contrast" : "outline"}
                onPress={() => setSelected(item.id)}
                fullWidth
              />
            );
          }}
        />

        <AppButton
          title="Continuar"
          variant="contrast"
          disabled={!selected}
          onPress={handleContinue}
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 132,
    paddingHorizontal: 24,
    justifyContent: "center",
    paddingBottom: 124,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 32,
    textAlign: "center",
    fontSize: 16,
  },

  list: {
    gap: 12,
    marginBottom: 24,
  },
});