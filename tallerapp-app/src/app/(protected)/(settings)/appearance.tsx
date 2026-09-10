import { Pressable, ScrollView, StyleSheet, Text, View, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { AppearanceMode, useAppearance } from "@/context/appearanceContext";
import AppPageTitle from "@/components/ui/AppPageTitle";

const OPTIONS: { value: AppearanceMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: "light", label: "Claro", icon: "sunny-outline" },
  { value: "dark", label: "Oscuro", icon: "moon-outline" },
  { value: "system", label: "Sistema", icon: "phone-portrait-outline" },
];

export default function AppearanceScreen() {
  const scheme = useColorScheme() ?? "dark";
  const colors = Colors[scheme];
  const { appearance, setAppearance } = useAppearance();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <AppPageTitle
        title="Apariencia"
        icon={<Ionicons name="color-palette-outline" size={20} color={colors.text} />}
      />

      <Text style={[styles.description, { color: colors.subtitle }]}>
        Elegí el tema de la aplicación. Podés usar el del sistema o forzar uno.
      </Text>

      <View style={{ gap: 12 }}>
        {OPTIONS.map((option) => {
          const selected = appearance === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => setAppearance(option.value)}
              style={[
                styles.option,
                {
                  backgroundColor: colors.surface,
                  borderColor: selected ? colors.primary : colors.border,
                },
              ]}
            >
              <Ionicons
                name={option.icon}
                size={22}
                color={selected ? colors.primary : colors.subtitle}
              />
              <Text style={[styles.optionLabel, { color: colors.text }]}>{option.label}</Text>
              {selected && <Ionicons name="checkmark-circle" size={22} color={colors.primary} />}
            </Pressable>
          );
        })}
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
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
});