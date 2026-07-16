import { useContext } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { Controller, useForm } from "react-hook-form";

import { AuthContext } from "@/context/authContext";
import { useModal } from "@/context/ModalContextForm";

import { useProducts } from "@/hooks/useProduct";
import { useClient } from "@/hooks/useClient";

import CreateClientForm from "@/components/CreateClientForm";
import CreateProductForm from "@/components/CreateProductForm";

import AppHeader from "@/components/ui/AppHeader";
import AppCard from "@/components/ui/AppCard";
import AppSectionTitle from "@/components/ui/AppSectionTitle";
import AppDatePicker from "@/components/ui/AppDatePicker";
import AppSelect from "@/components/ui/AppSelect";
import AppButton from "@/components/ui/AppButton";
import AppLoading from "@/components/ui/AppLoading";
import AppEmptyState from "@/components/ui/AppEmptyState";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";

type Option = {
  label: string;
  value: number;
};

type FormData = {
  product: Option | null;
  client: Option | null;
  date_entry: Date;
};

export default function CreateService() {
  const auth = useContext(AuthContext);

  const { openModal } = useModal();

  const productsQuery = useProducts();

  const clientsQuery = useClient(auth.organizationId);

  const scheme = useColorScheme() ?? "dark";
  const colors = Colors[scheme];
  const {
    control,
    handleSubmit,
  } = useForm<FormData>({
    defaultValues: {
      product: null,
      client: null,
      date_entry: new Date(),
    },
  });

  if (productsQuery.isLoading || clientsQuery.isLoading) {
    return (
      <AppLoading message="Cargando información..." />
    );
  }

  if (productsQuery.isError || clientsQuery.isError) {
    return (
      <AppEmptyState
        icon="alert-circle-outline"
        title="Ha ocurrido un error"
        description="No fue posible cargar la información."
      />
    );
  }

  const products = productsQuery.data ?? [];

  const clients = clientsQuery.data?.clients ?? [];

  const productOptions = products.map((product) => ({
    label: `${product.name} • ${product.brand} (${product.model})`,
    value: product.id,
  }));

  const clientOptions = clients.map((client) => ({
    label: client.name,
    value: client.id,
  }));

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <AppHeader
        title="Crear Servicio"
      />

      <ScrollView
        contentContainerStyle={styles.content}
      >
        <AppCard>

          <AppSectionTitle>
            Datos del servicio
          </AppSectionTitle>

          <Controller
            control={control}
            name="date_entry"
            rules={{
              required: "Seleccione una fecha",
            }}
            render={({
              field: {
                value,
                onChange,
              },
              fieldState: {
                error,
              },
            }) => (
              <AppDatePicker
                label="Fecha de ingreso"
                required
                value={value}
                onChange={onChange}
                error={error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="product"
            rules={{
              required: "Seleccione un producto",
            }}
            render={({
              field: {
                value,
                onChange,
              },
              fieldState: {
                error,
              },
            }) => (
              <View style={ styles.row } >
                <View style={ styles.select } >
                  <AppSelect
                    label="Producto"
                    required
                    title="Productos"
                    placeholder="Seleccione un producto"
                    data={productOptions}
                    selected={value}
                    onSelect={onChange}
                    error={error?.message}
                  />
                </View>
                <AppButton
                  variant="contrast"
                  fullWidth={false}
                  icon={
                    <Ionicons
                      name="add"
                      size={24}
                      color={colors.background}
                    />
                  }
                  style={ styles.addButton }
                  onPress={() =>
                    openModal(<CreateProductForm />)
                  }
                />
              </View>
              
            )}
          />

          <View style={{ height: 20 }} />

          <Controller
            control={control}
            name="client"
            rules={{
              required: "Seleccione un cliente",
            }}
            render={({
              field: {
                value,
                onChange,
              },
              fieldState: {
                error,
              },
            }) => (
              <View style={ styles.row } >
                <View style={ styles.select } >
                  <AppSelect
                    label="Cliente"
                    required
                    title="Clientes"
                    placeholder="Seleccione un cliente"
                    data={clientOptions}
                    selected={value}
                    onSelect={onChange}
                    error={error?.message}
                  />
                </View>
                

                <AppButton
                  variant="contrast"
                  fullWidth={false}
                  icon={
                    <Ionicons
                      name="add"
                      size={24}
                      color={colors.background}
                    />
                  }
                  style={ styles.addButton }
                  onPress={() =>
                    openModal(<CreateClientForm />)
                  }
                />
              </View>

            )}
          />


        </AppCard>

        <AppButton
          title="Crear Servicio"
          variant="contrast"
          onPress={handleSubmit(onSubmit)}
          icon={
            <Ionicons 
              name="save"
              size={24}
              color={colors.background}
            />
          }
        />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  row:{
    flexDirection:'row',
    alignItems:'center',
    gap:10,
  },

  select:{
      flex:1,
  },

  addButton:{
      width:54,
      paddingHorizontal:0,
  }

});