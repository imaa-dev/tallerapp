import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import {
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import { Colors } from '@/constants/theme';

type Item = {
  label: string;
  value: number;
};

type Props = {
  data: Item[];
  selected?: Item | null;
  onSelect: (item: Item) => void;
  placeholder?: string;
  title?: string;
};

const SelectBottomSheet = ({
  data,
  selected,
  onSelect,
  placeholder = 'Seleccionar...',
  title = 'Seleccionar'
}: Props) => {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['60%', '90%'], []);
  const [search, setSearch] = useState('');

  const filtered = data.filter(item =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  const open = () => {
    bottomSheetRef.current?.present()
  };
  const close = () => bottomSheetRef.current?.dismiss();
  
  return (
    <>
      {/* INPUT */}
      <TouchableOpacity style={styles.input} onPress={() => open()}>
        <Text style={{ color: colors.text }} >
          {selected ? selected.label : placeholder}
        </Text>
      </TouchableOpacity>

      {/* MODAL */}
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: 'white' }}
        enableDynamicSizing={false}
      >
        <View style={styles.container}>
          
          <Text style={styles.title}>{title}</Text>

          <TextInput
            placeholder="Buscar..."
            value={search}
            onChangeText={setSearch}
            style={styles.search}
          />

          <FlatList
            data={filtered}
            keyExtractor={(item) => item.value.toString()}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => {
              const isSelected = selected?.value === item.value;

              return (
                <TouchableOpacity
                  style={[
                    styles.item,
                    isSelected && styles.selected
                  ]}
                  onPress={() => {
                    onSelect(item);
                    close();
                  }}
                >
                  <Text>{item.label}</Text>
                </TouchableOpacity>
              );
            }}
          />

        </View>
      </BottomSheetModal>
  </>
  );
};

export default SelectBottomSheet;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    marginTop: 10
  },
  container: {
    flex: 1,
    padding: 16
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  search: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10
  },
  item: {
    padding: 14,
    borderBottomWidth: 1,
    borderColor: '#eee'
  },
  selected: {
    backgroundColor: '#e6f0ff'
  }
});