import { useRef } from "react";
import {
  Text,
  View,
  TextInput,
  Pressable,
} from "react-native";
import PhoneInput from "react-native-phone-number-input";
import { Controller, useForm } from "react-hook-form";

type FormData = {
  name: string;
  email: string;
  phone: string;
};

export default function CreateClientForm() {

  const phoneInput = useRef<PhoneInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
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
        Crear Cliente
      </Text>

      {/* NAME */}
      <View style={{ gap: 6 }}>
        <Text>Nombre</Text>

        <Controller
          control={control}
          name="name"
          rules={{
            required: "El nombre es obligatorio",
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Nombre del cliente"
              value={value}
              onChangeText={onChange}
              style={{
                borderWidth: 1,
                borderColor: errors.name
                  ? "red"
                  : "#d1d5db",
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
              }}
            />
          )}
        />

        {errors.name && (
          <Text style={{ color: "red" }}>
            {errors.name.message}
          </Text>
        )}
      </View>

      {/* EMAIL */}
      <View style={{ gap: 6 }}>
        <Text>Email</Text>

        <Controller
          control={control}
          name="email"
          rules={{
            required: "El email es obligatorio",
            pattern: {
              value:
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Email inválido",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Email"
              value={value}
              onChangeText={onChange}
              keyboardType="email-address"
              autoCapitalize="none"
              style={{
                borderWidth: 1,
                borderColor: errors.email
                  ? "red"
                  : "#d1d5db",
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
              }}
            />
          )}
        />

        {errors.email && (
          <Text style={{ color: "red" }}>
            {errors.email.message}
          </Text>
        )}
      </View>

      {/* PHONE */}
      <View style={{ gap: 6 }}>
        <Text>Celular</Text>

        <Controller
          control={control}
          name="phone"
          rules={{
            required: "El celular es obligatorio",
          }}
          render={({ field: { onChange, value } }) => (
            <PhoneInput
              ref={phoneInput}
              defaultCode="CL"
              layout="first"
              value={value}
              onChangeFormattedText={(text) => {
                onChange(text);
              }}
              withDarkTheme
              withShadow
              autoFocus={false}
            />
          )}
        />

        {errors.phone && (
          <Text style={{ color: "red" }}>
            {errors.phone.message}
          </Text>
        )}
      </View>

      <Pressable
        onPress={handleSubmit(onSubmit)}
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
          Guardar cliente
        </Text>
      </Pressable>
    </View>
  );
}