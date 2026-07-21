import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme
} from "react-native";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useModal } from "@/context/ModalContextForm";
import { useProducts } from "@/hooks/useProduct";
import { useClient } from "@/hooks/useClient";
import CreateClientForm from "@/components/CreateClientForm";
import CreateProductForm from "@/components/CreateProductForm";
import AppCard from "@/components/ui/AppCard";
import AppSectionTitle from "@/components/ui/AppSectionTitle";
import AppDatePicker from "@/components/ui/AppDatePicker";
import AppSelect from "@/components/ui/AppSelect";
import AppButton from "@/components/ui/AppButton";
import AppLoading from "@/components/ui/AppLoading";
import AppEmptyState from "@/components/ui/AppEmptyState";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import AppPageTitle from "@/components/ui/AppPageTitle";
import AppTextInput from "@/components/ui/AppTextInput";
import { useToast } from "@/context/ToastContext";
import AppErrorText from "@/components/ui/AppErrorText";
import AppPhotoGrid from "@/components/ui/AppPhotoGrid";
import { useLoading } from "@/context/LoadingContext";
import * as ImagePicker from "expo-image-picker";
import {FormDataService} from "@/types/servi/servi.type";
import {createService} from "@/services/services/service.service";
import {useRouter} from "expo-router";
import {useQueryClient} from "@tanstack/react-query";



export default function CreateService() {

  const productsQuery = useProducts();
  const clientsQuery = useClient();
  const queryClient = useQueryClient();
  const scheme = useColorScheme() ?? "dark";
  const colors = Colors[scheme];
  const { showToast } = useToast();
  const { showLoading, hideLoading } = useLoading();
  const { openModal } = useModal();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormDataService>({
    defaultValues: {
      product: null,
      client: null,
      date_entry: new Date(),
      file: [],
      reason: "",
      reason_notes: [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "reason_notes",
  });
  if (productsQuery.isLoading || clientsQuery.isLoading) {
    return (
      <AppLoading message="Cargando información..." />
    );
  }
  const reason = watch("reason");
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

  const onSubmit = async (data: FormDataService) => {
    try {
      showLoading()
      const response = await createService(data);
      console.log(response)
      if (response.status === 'success') {
        console.log("OK:", response.message);

        // 2. Toast de éxito
        showToast('success', 'Servicio Creado', response.message);
        await queryClient.invalidateQueries({
          queryKey: ['countTypeServices'],
        })
        router.push("/recepcionados")
      } else {
        // Por si el backend devuelve 200 pero con status: 'fail'
        throw new Error(response.message);
      }

    } catch (e: any) {
      // Aquí caen 422, 500, 401 etc porque axios tira error
      const errorData = e.response?.data;
      // 1. Errores de validación 422
      if (errorData?.status === 'fail' && errorData?.errors) {
        showToast('error', 'Error de validacion de datos', errorData.message);
      }
      // 2. Error 500
      else if (errorData?.status === 'error') {
         showToast('error', 'Error en el server', 'Error del servidor. Trace: ' + errorData.meta?.trace_id, );
      }
      // 3. Error 401
      else if (e.response?.status === 401) {
        // aqui manejar error con interceptor axios
        router.push( "/login")
      }
      else {
        showToast('error', 'Ocurrió un error inesperado', 'ERROR');
      }

    } finally {
      hideLoading();
    }
  };

  const handleAddImages = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        showToast(
          "error",
          "Permiso denegado",
          "Debes permitir el acceso a tus fotos."
        );
        return;
      }

      showLoading();

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 9,
      });

      if (result.canceled) return;

      setValue("file", [
        ...watch("file"),
        ...result.assets,
      ]);
    } catch (err) {
      console.error(err);

      showToast(
        "error",
        "Error",
        "No fue posible seleccionar las imágenes."
      );
    } finally {
      hideLoading();
    }
  };

  const removeImage = (index: number) => {
    const updated = watch("file").filter((_, i) => i !== index);

    setValue("file", updated, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <AppPageTitle 
        title="Crear Servicio" 
        icon={<Ionicons 
          name="save" 
          size={20} 
          color={colors.text} 
        />}  
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
        <AppCard>

          <AppSectionTitle>
            Detalles del ingreso
          </AppSectionTitle>

          <Controller
            control={control}
            name="reason"
            render={({ field: { value, onChange } }) => (
              <AppTextInput
                label="Agregar detalle ingreso de servicio"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          <AppButton
            title="Agregar Detalle"
            variant="contrast"
            icon={    
              <Ionicons
                name="add"
                size={20}
                color="#FFF"
              />
            }
            onPress={() => {
              if (!reason.trim()) {
                showToast(
                  "error",
                  "Error Al Agregar Detalle",
                  "El detalle de ingreso no puede ir vacío",
                );
                return;
              }

              setValue("reason_notes", [
                ...watch("reason_notes"),
                { reason_note: reason },
              ]);
              setValue("reason", "");
            }}
            style={{ marginTop: 16 }}
          />

          {errors.reason_notes && (
            <AppErrorText>
              {errors.reason_notes.message}
            </AppErrorText>
          )}

          {watch("reason_notes").length > 0 && (
            <View style={styles.listContainer}>
              <AppSectionTitle>
                Detalles agregados
              </AppSectionTitle>

              {watch("reason_notes").map((item, index) => (
                <View
                  key={index}
                  style={styles.reasonItem}
                >
                  <Text style={styles.reasonText}>
                    • {item.reason_note}
                  </Text>

                  <Pressable
                    onPress={() => {
                      const updated = watch("reason_notes").filter(
                        (_, i) => i !== index
                      );

                      setValue("reason_notes", updated);
                      remove(index);
                    }}
                  >
                    <Text style={styles.deleteText}>
                      Eliminar
                    </Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </AppCard>

        <AppCard>

          <AppSectionTitle>
            Fotos y registros del servicio
          </AppSectionTitle>

          <AppPhotoGrid
            images={watch("file").map(image => image.uri)}
            onAdd={handleAddImages}
            onRemove={removeImage}
            maxImages={9}
          />

          <AppErrorText>
            {errors.file?.message}
          </AppErrorText>

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
  },

  listContainer: {
    marginTop: 24,
  },

  reasonItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  reasonText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },

  deleteText: {
    color: "#ef4444",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 16,
  },
});