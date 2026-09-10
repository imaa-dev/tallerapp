import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

type Item = {
  label: string;
  value: number;
};

type Props = {
  data: Item[];
  selectedValues?: number[];
  onConfirm?: (items: Item[]) => void;
  placeholder?: string;
  title?: string;
  renderSelected?: (items: Item[]) => React.ReactNode;
};

const MultiSelectBottomSheet = ({
  data,
  selectedValues = [],
  onConfirm,
  placeholder = 'Seleccionar...',
  title = 'Seleccionar',
  renderSelected,
}: Props) => {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [tempSelected, setTempSelected] = useState<number[]>([]);

  const filtered = useMemo(
    () =>
      data.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase())
      ),
    [data, search]
  );

  const open = () => {
    setSearch('');
    setTempSelected(selectedValues);
    setVisible(true);
  };

  const close = () => setVisible(false);

  const toggleItem = (value: number) => {
    setTempSelected((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(data.filter((item) => tempSelected.includes(item.value)));
    }
    close();
  };

  const selectedItems = data.filter((item) => selectedValues.includes(item.value));

  return (
    <>
      <TouchableOpacity
        style={[
          styles.input,
          {
            borderColor: colors.border,
            backgroundColor: colors.surface,
            minHeight: 54,
          },
        ]}
        onPress={open}
      >
        {selectedItems.length > 0 ? (
          renderSelected ? (
            renderSelected(selectedItems)
          ) : (
            <View style={styles.selectedWrap}>
              <Text style={{ color: colors.text, fontSize: 14 }}>
                {selectedItems.map((i) => i.label).join(', ')}
              </Text>
            </View>
          )
        ) : (
          <View style={styles.selectedWrap}>
            <Text style={{ color: colors.placeholder }}>{placeholder}</Text>
          </View>
        )}
        <Ionicons name="chevron-down" size={18} color={colors.subtitle} />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={close}
      >
        <Pressable style={styles.overlay} onPress={close}>
          <Pressable style={[styles.sheet, { backgroundColor: colors.surface }]}>
            <View style={[styles.handle, { backgroundColor: colors.border }]} />

            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
              <TouchableOpacity onPress={close} hitSlop={8}>
                <Ionicons name="close" size={22} color={colors.subtitle} />
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="Buscar..."
              placeholderTextColor={colors.placeholder}
              value={search}
              onChangeText={setSearch}
              style={[
                styles.search,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                  color: colors.text,
                },
              ]}
            />

            {filtered.length === 0 && (
              <Text style={{ color: colors.subtitle, textAlign: 'center', paddingVertical: 16 }}>
                No hay repuestos disponibles.
              </Text>
            )}

            <FlatList
              data={filtered}
              keyExtractor={(item) => item.value.toString()}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 24 }}
              renderItem={({ item }) => {
                const isSelected = tempSelected.includes(item.value);

                return (
                  <TouchableOpacity
                    style={[
                      styles.item,
                      { borderBottomColor: colors.border },
                      isSelected && { backgroundColor: colors.primary + '1A' },
                    ]}
                    onPress={() => toggleItem(item.value)}
                  >
                    <Text style={[styles.itemText, { color: colors.text }]}>
                      {item.label}
                    </Text>
                    {isSelected ? (
                      <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                    ) : (
                      <Ionicons name="ellipse-outline" size={22} color={colors.placeholder} />
                    )}
                  </TouchableOpacity>
                );
              }}
            />

            <TouchableOpacity
              style={[
                styles.confirmButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmText}>Confirmar ({tempSelected.length})</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

export default MultiSelectBottomSheet;

const styles = StyleSheet.create({
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  selectedWrap: {
    flex: 1,
    paddingVertical: 14,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheet: {
    height: '70%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    marginTop: 10,
    marginBottom: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  search: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itemText: {
    fontSize: 16,
    flexShrink: 1,
  },
  confirmButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});