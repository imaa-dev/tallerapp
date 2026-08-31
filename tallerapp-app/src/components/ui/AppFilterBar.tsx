import React from "react";
import { View, TextInput, StyleSheet, useColorScheme, Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";

export interface FilterField {
  key: string;
  label: string;
  placeholder?: string;
  type?: "text" | "select";
  options?: { label: string; value: string }[];
}

interface Props {
  fields: FilterField[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onSearch?: () => void;
  onClear?: () => void;
}

export default function AppFilterBar({ fields, values, onChange, onSearch, onClear }: Props) {
  const scheme = useColorScheme() ?? "dark";
  const colors = Colors[scheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {fields.map((field) => (
        <View key={field.key} style={styles.field}>
          <Text style={[styles.label, { color: colors.subtitle }]}>{field.label}</Text>
          <TextInput
            style={[styles.input, { color: colors.text, backgroundColor: colors.background, borderColor: colors.border }]}
            placeholder={field.placeholder ?? field.label}
            placeholderTextColor={colors.placeholder}
            value={values[field.key] ?? ""}
            onChangeText={(v) => onChange(field.key, v)}
            onSubmitEditing={onSearch}
            returnKeyType="search"
          />
        </View>
      ))}
      <View style={styles.actions}>
        {onClear && (
          <Pressable onPress={onClear} style={[styles.btn, { backgroundColor: colors.background }]}>
            <Ionicons name="close-circle-outline" size={20} color={colors.subtitle} />
            <Text style={{ color: colors.subtitle, fontSize: 13 }}>Limpiar</Text>
          </Pressable>
        )}
        {onSearch && (
          <Pressable onPress={onSearch} style={[styles.btn, { backgroundColor: colors.primary }]}>
            <Ionicons name="search" size={18} color="#fff" />
            <Text style={{ color: "#fff", fontSize: 13, fontWeight: "600" }}>Buscar</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  field: {
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
  },
  input: {
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  btn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 38,
    borderRadius: 8,
  },
});
