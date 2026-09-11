import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
  useColorScheme,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { ServiceRecord } from "@/types/servi/servi.type";
import { Colors } from "@/constants/theme";

export interface ServiceAction {
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: (service: ServiceRecord) => void;
  danger?: boolean;
}

interface Props {
  service: ServiceRecord;
  actions: ServiceAction[];
}

export function ActionBottomSheet({ service, actions }: Props) {
  const scheme = useColorScheme() ?? "dark";
  const colors = Colors[scheme];
  const [visible, setVisible] = useState(false);

  const open = () => setVisible(true);
  const close = () => setVisible(false);

  return (
    <>
      <TouchableOpacity onPress={open} hitSlop={8}>
        <MaterialIcons name="more-vert" size={24} color={colors.text} />
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
            {actions.map((action) => (
              <TouchableOpacity
                key={action.title}
                style={[styles.item, { borderBottomColor: colors.border }]}
                onPress={() => {
                  close();
                  action.onPress(service);
                }}
              >
                <MaterialIcons
                  name={action.icon}
                  size={22}
                  color={action.danger ? colors.danger : colors.text}
                />
                <Text
                  style={[
                    styles.text,
                    { color: action.danger ? colors.danger : colors.text },
                  ]}
                >
                  {action.title}
                </Text>
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 24,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    marginTop: 10,
    marginBottom: 6,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  text: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "500",
  },
});