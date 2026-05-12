import { useState } from "react";
import {
  Text,
  View,
  TextInput,
  Pressable,
} from "react-native";

type FormData = {
  name: string;
  brand: string;
  model: string;
};

export default function CreateProductForm() {
  const [form, setForm] = useState<FormData>({
    name: "",
    brand: "",
    model: "",
  });

  const handleChange = (
    field: keyof FormData,
    value: string
  ) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    console.log(form);
  };

  return (
    <View
      style={{
        gap: 16,
      }}
    >
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
        }}
      >
        Crear producto
      </Text>

      <View style={{ gap: 6 }}>
        <Text>Nombre</Text>

        <TextInput
          placeholder="Nombre del producto"
          value={form.name}
          onChangeText={text =>
            handleChange("name", text)
          }
          style={{
            borderWidth: 1,
            borderColor: "#d1d5db",
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 12,
          }}
        />
      </View>

      <View style={{ gap: 6 }}>
        <Text>Marca</Text>

        <TextInput
          placeholder="Marca"
          value={form.brand}
          onChangeText={text =>
            handleChange("brand", text)
          }
          style={{
            borderWidth: 1,
            borderColor: "#d1d5db",
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 12,
          }}
        />
      </View>

      <View style={{ gap: 6 }}>
        <Text>Modelo</Text>

        <TextInput
          placeholder="Modelo"
          value={form.model}
          onChangeText={text =>
            handleChange("model", text)
          }
          style={{
            borderWidth: 1,
            borderColor: "#d1d5db",
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 12,
          }}
        />
      </View>

      <Pressable
        onPress={handleSubmit}
        style={{
          backgroundColor: "#111827",
          paddingVertical: 14,
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "600",
            fontSize: 16,
          }}
        >
          Guardar producto
        </Text>
      </Pressable>
    </View>
  );
}