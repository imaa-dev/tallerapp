import { useContext, useState } from "react";
import { 
  Text, 
  StyleSheet,
  Button,
  View
} from "react-native";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useProducts } from "@/hooks/useProduct";
import SelectBottomSheet from '@/components/SelectBottomSheet';
import { Controller, useForm } from 'react-hook-form';
import { useClient } from "@/hooks/useClient";
import { AuthContext } from "@/context/authContext";
import { useModal } from "@/context/ModalContextForm";
import CreateProductForm from "@/components/CreateProductForm";

export default function CreateService(){
  const authContext = useContext(AuthContext);
  const { openModal } = useModal();
  const productsQuery = useProducts();
  const clientsQuery = useClient(authContext.organizationId);
  const {
    control,
    handleSubmit,
    setValue,
    watch
  } = useForm<FormData>({
    defaultValues: {
      product: null,
      date: new Date()
    }
  });
  const products = productsQuery.data ?? [];
  const clients = clientsQuery.data ?? [];
  if (productsQuery.isLoading) return <Text>Cargando...</Text>;
  if (productsQuery.isError) return <Text>Error al cargar datos.</Text>;
  if (clientsQuery.isLoading) return <Text> Cargando... </Text>;
  if (clientsQuery.isError) return <Text>Error al cargar datos.</Text>
  const productOptions = products.map(p => ({
    label: `${p.name} • ${p.brand} (${p.model})`,
    value: p.id
  }));
  const clientOptions = clients.clients.map(c => ({
    label: `${c.name}`,
    value: c.id
  }));

 const selectedProduct = watch('product');
 
  const date = watch('date');

  const showMode = (currentMode: any) => {
    DateTimePickerAndroid.open({
      value: date,
       onChange: (_, selectedDate) => {
      if (selectedDate) {
        setValue('date', selectedDate);
      }
    },
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };
  type FormData = {
    product: {
      label: string;
      value: number;
    } | null;
    client: {
      label: string;
      value: number;
    } | null;

    date: Date;
  };
  
  const onSubmit = (data: FormData) => {
    console.log('ONSUBMIT')
    console.log(data);
  };
  return(
      <View style={styles.container}>
        <Text> Fecha De ingreso </Text>
        <Button 
          onPress={showDatepicker} 
          title="Inagresar Fecha" 
        />
        <Button 
          onPress={showTimepicker} 
          title="Ingresar Hora" 
        />
        <Text>
          Fecha seleccionada: {date.toLocaleString()}
        </Text>
        <Controller 
          control={control}
          name='product'
          rules={{
            required: 'Debes seleccionar un producto'
          }}
          render={({ field: { value, onChange } }) => (
            <SelectBottomSheet
              data={productOptions}
              selected={value}
              onSelect={onChange}
              placeholder="Producto"
              title="Productos"
            />
          )}
        />
        <Button
          title="Agregar Producto"
          onPress={() => openModal( <CreateProductForm /> )}
        />
        <Controller 
          control={control}
          name='client'
          rules={{
            required: 'Debes seleccionar un cliente'
          }}
          render={({ field: { value, onChange } }) => (
            <SelectBottomSheet
              data={clientOptions}
              selected={value}
              onSelect={onChange}
              placeholder="Cliente"
              title="Clientes"
            />
          )}
        />
        <Button
          title="Crear Servicio"
          onPress={handleSubmit(onSubmit)}
        />
        
      </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16
    },
    text: {
        textAlign: "center"
    }

  })