import { useLoading } from "@/context/LoadingContext";
import { useModal } from "@/context/ModalContextForm";
import { useToast } from "@/context/ToastContext";
import { createProduct } from "@/services/product/product.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
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

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      brand: "",
      model: "",
    },
  });
  const queryClient = useQueryClient();
  const {closeModal } = useModal();
  const { showLoading, hideLoading } = useLoading();
  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn: createProduct,

    onMutate: () => {
      showLoading();
    },

    onSuccess: async (res) => {
      await queryClient.invalidateQueries({
        queryKey: ['products']
      });
      showToast(
        "success",
        "Producto creado",
            res.data.message
      )
      closeModal();
    },

    onError: (error) => {
      showToast(
        "error",
        "Error",
        "Error al crear producto"
      )
      console.log(error);
    },

    onSettled: () => {
      hideLoading();
    }
  });

  const onSubmit = async (data: FormData) => {
    mutation.mutate(data);
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
              placeholder="Nombre del producto"
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

      {/* BRAND */}
      <View style={{ gap: 6 }}>
        <Text>Marca</Text>

        <Controller
          control={control}
          name="brand"
          rules={{
            required: "La marca es obligatoria",
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Marca"
              value={value}
              onChangeText={onChange}
              style={{
                borderWidth: 1,
                borderColor: errors.brand
                  ? "red"
                  : "#d1d5db",
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
              }}
            />
          )}
        />

        {errors.brand && (
          <Text style={{ color: "red" }}>
            {errors.brand.message}
          </Text>
        )}
      </View>

      {/* MODEL */}
      <View style={{ gap: 6 }}>
        <Text>Modelo</Text>

        <Controller
          control={control}
          name="model"
          rules={{
            required: "El modelo es obligatorio",
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Modelo"
              value={value}
              onChangeText={onChange}
              style={{
                borderWidth: 1,
                borderColor: errors.model
                  ? "red"
                  : "#d1d5db",
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
              }}
            />
          )}
        />

        {errors.model && (
          <Text style={{ color: "red" }}>
            {errors.model.message}
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
          Guardar producto
        </Text>
      </Pressable>
    </View>
  );
}